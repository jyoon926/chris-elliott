import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { Painting, Collections, Collection } from "../types";
import {
  MdDelete,
  MdOutlineAddBox,
  MdDragIndicator,
} from "react-icons/md";
import Modal from "./Modal";
import UploadPaintingForm from "./Upload";
import CollectionList from "./CollectionList";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { getCollectionsFromPaintings, getPaintings } from "../utils/database";
import { stringToUrl } from "../utils/utils";

function ManagePaintings() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setCollection] = useState<Collection | undefined>();
  const [selectedPaintings, setSelectedPaintings] = useState<number[]>([]);

  // For debouncing updates
  const saveTimers = useRef<Record<number, NodeJS.Timeout>>({});

  const filteredPaintings = selectedCollection
    ? paintings.filter(
      (painting) =>
        stringToUrl(painting.collection) === selectedCollection.url
    )
    : paintings;

  const fetchData = async (): Promise<void> => {
    const p = await getPaintings();
    setPaintings(p);
    setCollections(getCollectionsFromPaintings(p));
  };

  useEffect(() => {
    document.title = "Admin - Manage Paintings | Chris Elliott Art Gallery";
    fetchData();
  }, []);

  const deletePainting = async (id: number): Promise<void> => {
    const { error } = await supabase.from("paintings").delete().eq("id", id);
    if (error) {
      console.error("Error deleting painting:", error);
    } else {
      fetchData();
    }
  };

  const updatePainting = async (updatedPainting: Painting): Promise<void> => {
    const { error } = await supabase
      .from("paintings")
      .update(updatedPainting)
      .eq("id", updatedPainting.id);
    if (error) {
      console.error("Error updating painting:", error);
    }
  };

  const updateOrder = async (paintings: Painting[]): Promise<void> => {
    const { data, error } = await supabase
      .from("paintings")
      .upsert(paintings, { onConflict: "id" });

    if (error) {
      console.error("Error updating paintings:", error);
    } else {
      console.log("Successfully updated paintings:", data);
    }
  };

  const handleChange = (id: number, key: keyof Painting, value: unknown): void => {
    setPaintings((prevPaintings) =>
      prevPaintings.map((painting) =>
        painting.id === id ? { ...painting, [key]: value } : painting
      )
    );

    // Debounce the save for this painting
    if (saveTimers.current[id]) {
      clearTimeout(saveTimers.current[id]);
    }
    saveTimers.current[id] = setTimeout(() => {
      const paintingToSave = paintings.find((p) => p.id === id);
      if (paintingToSave) {
        updatePainting({ ...paintingToSave, [key]: value } as Painting);
      }
    }, 500); // 0.5s delay after typing
  };

  const togglePaintingSelection = (id: number) => {
    setSelectedPaintings((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((paintingId) => paintingId !== id)
        : [...prevSelected, id]
    );
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) return;

    let items = [...filteredPaintings];
    const selectedIds = new Set(selectedPaintings);

    let movingItems: Painting[];
    if (selectedIds.has(Number(result.draggableId))) {
      movingItems = items.filter((item) => selectedIds.has(item.id));
      items = items.filter((item) => !selectedIds.has(item.id));
    } else {
      movingItems = [items[result.source.index]];
      items.splice(result.source.index, 1);
    }

    items.splice(result.destination.index, 0, ...movingItems);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setPaintings((prevPaintings) =>
      prevPaintings
        .map((painting) => updatedItems.find((u) => u.id === painting.id) || painting)
        .sort((a, b) => a.order - b.order)
    );

    await updateOrder(updatedItems);
  };

  return (
    <>
      {/* Upload Painting */}
      <div className="flex flex-row gap-3 py-5">
        <button
          className="button flex flex-row justify-center items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <MdOutlineAddBox className="text-xl" /> Upload painting
        </button>
      </div>

      {/* Collections */}
      <CollectionList
        collections={collections}
        selectedCollection={selectedCollection}
        setCollection={setCollection}
      />

      {/* Paintings Table */}
      <div className="bg-white p-5 w-full mb-5">
        <div className="dashboard w-full">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <table
                  className="w-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <thead>
                    <tr className="border-b">
                      <th></th>
                      <th className="shift">Image</th>
                      <th className="shift">Title</th>
                      <th className="shift">Collection</th>
                      <th className="shift">Medium</th>
                      <th className="shift">Width</th>
                      <th className="shift">Height</th>
                      <th className="shfit">Year</th>
                      <th className="shfit">Price</th>
                      <th className="shift">Display Price</th>
                      <th className="shift">Purchased</th>
                      <th className="shift">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPaintings.map((painting, index) => (
                      <Draggable
                        key={painting.id}
                        draggableId={painting.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${!snapshot.isDragging &&
                              selectedPaintings.includes(painting.id) &&
                              "bg-gray-100"
                              } ${snapshot.isDragging && "bg-gray-100"}`}
                          >
                            <td
                              {...provided.dragHandleProps}
                              onClick={() => togglePaintingSelection(painting.id)}
                            >
                              <MdDragIndicator className="text-xl cursor-move opacity-60" />
                            </td>
                            <td>
                              <img className="h-12" src={painting.photoS} alt="" />
                            </td>
                            <td>
                              <input
                                className="w-80 font-bold"
                                type="text"
                                value={painting.title}
                                onChange={(e) =>
                                  handleChange(painting.id, "title", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <select
                                value={painting.collection}
                                onChange={(e) =>
                                  handleChange(painting.id, "collection", e.target.value)
                                }
                              >
                                {Collections.map((collection) => (
                                  <option key={collection} value={collection}>
                                    {collection}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={painting.medium}
                                onChange={(e) =>
                                  handleChange(painting.id, "medium", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-14"
                                type="number"
                                value={painting.width || ""}
                                onChange={(e) =>
                                  handleChange(painting.id, "width", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-14"
                                type="number"
                                value={painting.height || ""}
                                onChange={(e) =>
                                  handleChange(painting.id, "height", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-28"
                                type="text"
                                value={painting.year || ""}
                                onChange={(e) =>
                                  handleChange(painting.id, "year", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-20"
                                type="number"
                                value={painting.price || ""}
                                onChange={(e) =>
                                  handleChange(painting.id, "price", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={painting.display_price}
                                onChange={(e) =>
                                  handleChange(painting.id, "display_price", e.target.checked)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={painting.purchased}
                                onChange={(e) =>
                                  handleChange(painting.id, "purchased", e.target.checked)
                                }
                              />
                            </td>
                            <td className="text-nowrap">
                              <button
                                className="icon delete"
                                onClick={() => deletePainting(painting.id)}
                              >
                                <MdDelete />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UploadPaintingForm
          onClose={() => setIsModalOpen(false)}
          refreshPaintings={fetchData}
          defaultCollection={selectedCollection?.name || ""}
        />
      </Modal>
    </>
  );
}

export default ManagePaintings;
