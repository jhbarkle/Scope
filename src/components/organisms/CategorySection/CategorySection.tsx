import { Category } from "../../../types";
import styles from "./CategorySection.module.scss";

interface CategorySectionProps {
  category: Category;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const getCategory = (category: Category) => {
    switch (category) {
      case "You":
        return <div>You Category Section</div>;
      case "Discover":
        return <div>Discover Category Section</div>;
      case "Search":
        return <div>Search Category Section</div>;
      case "Genres":
        return <div>Genres Category Section</div>;
      default:
        return <div>Default Category Section</div>;
    }
  };

  const categorySection = getCategory(category);

  return <div id={styles.category_section_container}>{categorySection}</div>;
};

export default CategorySection;
