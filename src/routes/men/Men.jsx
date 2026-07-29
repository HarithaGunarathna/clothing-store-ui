import CategoryPage from "../../components/CategoryPage";
import { ItemTags } from "../../constants/itemConstants";

export default function Men() {
  return (
    <CategoryPage
      tag={ItemTags.Men}
      title="Men"
      description="Outerwear and essentials, made to last."
    />
  );
}
