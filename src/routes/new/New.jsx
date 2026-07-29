import CategoryPage from "../../components/CategoryPage";
import { ItemTags } from "../../constants/itemConstants";

export default function New() {
  return (
    <CategoryPage
      tag={ItemTags.New}
      title="New in"
      description="Just landed — the newest 20 pieces first."
    />
  );
}
