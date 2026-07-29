import CategoryPage from "../../components/CategoryPage";
import { ItemTags } from "../../constants/itemConstants";

export default function Women() {
  return (
    <CategoryPage
      tag={ItemTags.Women}
      title="Women"
      description="Tailoring, knits and dresses cut for everyday wear."
    />
  );
}
