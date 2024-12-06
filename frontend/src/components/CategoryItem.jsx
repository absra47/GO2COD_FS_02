import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg h-96 group">
      <Link to={"/category" + category.href}>
        <div className="w-full h-full cursor-pointer">
          <div className="absolute inset-0 z-10 opacity-50 bg-gradient-to-b from-transparent to-gray-900" />
          <img
            src={category.imageUrl}
            alt={category.name}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
            <h3 className="mb-2 text-2xl font-bold text-white">
              {category.name}
            </h3>
            <p className="text-sm text-gray-200">Explore {category.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
