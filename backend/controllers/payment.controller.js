import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// backend/controllers/payment.controller.js

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    console.log("--- Starting Product Loop (Line Item Calculation) ---");
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents

      // --- Add console.logs here for each product ---
      console.log(`Processing Product:`);
      console.log(`  - Name: ${product.name}`);
      console.log(`  - Original Price (dollars): ${product.price}`);
      console.log(`  - Price for Stripe (cents): ${amount}`);
      console.log(`  - Quantity: ${product.quantity || 1}`);
      console.log(
        `  - Subtotal for this product (cents): ${amount * (product.quantity || 1)}`
      );

      totalAmount += amount * (product.quantity || 1); // Ensure quantity is handled if undefined
      console.log(
        `  - Running totalAmount (after this product, before coupon): ${totalAmount}`
      );
      // --- End console.logs for each product ---

      return {
        // Make sure this return statement is always there!
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    console.log("--- Finished Product Loop ---");

    console.log(
      "Total Amount after line item calculation (before coupon application):",
      totalAmount
    );

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        const discountAmount = Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
        totalAmount -= discountAmount;
        console.log(
          `Coupon applied: ${coupon.code}, Discount Percentage: ${coupon.discountPercentage}%, Discount Amount: ${discountAmount}`
        );
      } else {
        console.log(`Coupon code "${couponCode}" not found or inactive.`);
      }
    }

    // --- THIS IS THE MOST CRUCIAL LOG FOR THE ORIGINAL PROBLEM ---
    console.log(
      "Total Amount (final, after coupon, just before condition check):",
      totalAmount
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      // $200 in cents
      console.log(
        "Condition met: totalAmount is >= 20000. Creating new coupon."
      );
      await createNewCoupon(req.user._id);
    } else {
      console.log(
        "Condition NOT met: totalAmount is < 20000. Not creating new coupon."
      );
    }

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // --- NEW: Check if order already exists for this session ID ---
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

      if (existingOrder) {
        console.log(
          `Order for session ID ${sessionId} already exists. Returning existing order info.`
        );
        return res.status(200).json({
          success: true,
          message: "Payment successful, order already exists.",
          orderId: existingOrder._id, // Optionally return the existing order ID
        });
      }
      // --- END NEW CHECK ---

      // Only proceed if no existing order was found
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
        console.log(`Coupon ${session.metadata.couponCode} deactivated.`);
      }

      // create a new Order
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // convert from cents to dollars,
        stripeSessionId: sessionId,
      });

      await newOrder.save();
      console.log(`New order created with ID: ${newOrder._id}`);

      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      // Handle cases where payment_status is not 'paid' (e.g., 'unpaid', 'canceled')
      console.log(
        `Payment status for session ${sessionId} is ${session.payment_status}. No order created.`
      );
      res.status(200).json({
        success: false,
        message: `Payment status is ${session.payment_status}. No order created.`,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();
  console.log("New coupon created:", newCoupon);

  return newCoupon;
}
