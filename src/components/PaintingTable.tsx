import { Painting, Collection } from "../types";
import PaintingRow from "./PaintingRow";

interface PaintingTableProps {
  paintings: Painting[];
  collections: Collection[];
  onPaintingChange: (id: number, key: keyof Painting, value: any) => void;
  onUpdatePainting: (updatedPainting: Painting) => void;
  onDeletePainting: (id: number) => void;
}

const PaintingTable: React.FC<PaintingTableProps> = ({
  paintings,
  collections,
  onPaintingChange,
  onUpdatePainting,
  onDeletePainting,
}) => {
  return (
    <div className="dashboard w-full mb-32">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>Image</th>
            <th>Title</th>
            <th>Collection</th>
            <th>Medium</th>
            <th>Width</th>
            <th>Height</th>
            <th>Year</th>
            <th>Price</th>
            <th className="purchased">Purchased</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paintings.map((painting) => (
            <PaintingRow
              key={painting.id}
              painting={painting}
              collections={collections}
              onPaintingChange={onPaintingChange}
              onUpdatePainting={onUpdatePainting}
              onDeletePainting={onDeletePainting}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaintingTable;
