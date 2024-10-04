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
    <div className="flex flex-row flex-wrap pb-2 gap-2">
      <p
        onClick={() => setCollection(undefined)}
        className={`py-1.5 px-3.5 duration-300 cursor-pointer bg-white text-foreground ${
          selectedCollection && "opacity-50 hover:opacity-80"
        }`}
      >
        All Paintings
      </p>
      {collections.map((collection) => (
        <p
          key={collection.url}
          onClick={() => setCollection(collection)}
          className={`py-1.5 px-3.5 duration-300 cursor-pointer bg-white text-foreground ${
            selectedCollection?.url !== collection.url && "opacity-50 hover:opacity-80"
          }`}
        >
          {collection.name}
        </p>
      ))}
    </div>
  );
};

export default CollectionList;
