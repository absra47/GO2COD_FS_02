import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
export const validteCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      res.status(404).json({ message: "Coupon not found" });
      s;
    }
    if (coupon.expiryDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      res.status(404).json({ message: "Coupon is expired" });
    }
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validteCoupon controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
