import { Collection } from "../types";

interface CollectionListProps {
  collections: Collection[];
  selectedCollection: Collection | undefined;
  setCollection: (collection: Collection | undefined) => void;
}

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  selectedCollection,
  setCollection,
}) => {
  return (
    <div className="flex flex-row flex-wrap border-t py-5 gap-2">
      <p
        onClick={() => setCollection(undefined)}
        className={`border py-1.5 px-3.5 duration-300 rounded cursor-pointer ${
          selectedCollection
            ? "hover:bg-light"
            : "bg-foreground text-background"
        }`}
      >
        All Paintings
      </p>
      {collections.map((collection) => (
        <p
          key={collection.url}
          onClick={() => setCollection(collection)}
          className={`border py-1.5 px-3.5 duration-300 rounded cursor-pointer ${
            selectedCollection?.url === collection.url
              ? "bg-foreground text-background"
              : "hover:bg-light"
          }`}
        >
          {collection.name}
        </p>
      ))}
    </div>
  );
};

export default CollectionList;
