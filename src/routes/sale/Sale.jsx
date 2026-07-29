import CategoryPage from "../../components/CategoryPage";
import { ItemTags } from "../../constants/itemConstants";

export default function Sale() {
  return (
    <CategoryPage
      tag={ItemTags.Sale}
      title="Sale"
      description="Marked down, while stock lasts."
    />
  );
}
