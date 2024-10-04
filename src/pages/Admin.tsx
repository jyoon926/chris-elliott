import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Painting, Collections, Collection } from "../types";
import {
  MdSave,
  MdDelete,
  MdOutlineAddBox,
  MdDragIndicator,
} from "react-icons/md";
import Modal from "../components/Modal";
import UploadPaintingForm from "../components/Upload";
import CollectionList from "../components/CollectionList";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

function Admin() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCollection, setCollection] = useState<
    Collection | undefined
  >();
  const [selectedPaintings, setSelectedPaintings] = useState<number[]>([]);

  const filteredPaintings = selectedCollection
    ? paintings.filter(
        (painting) =>
          painting.collection.toLowerCase().replace(/\s+/g, "-") ===
          selectedCollection.url
      )
    : paintings;

  const fetchData = async (): Promise<void> => {
    const { data, error } = await supabase.from("paintings").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      data.sort((a, b) => a.order - b.order);
      const uniqueCollections = Array.from(
        new Set(data.map((painting: Painting) => painting.collection))
      );
      const collectionsArr: Collection[] = uniqueCollections.map(
        (collectionName: string) => {
          const collectionPaintings = data.filter(
            (painting: Painting) => painting.collection === collectionName
          );
          return {
            name: collectionName,
            url: collectionName.toLowerCase().replace(/\s+/g, "-"),
            photo: collectionPaintings[0]?.photoS || "",
          };
        }
      );
      setPaintings(data);
      setCollections(collectionsArr);
    }
  };

  useEffect(() => {
    document.title = "Admin | Chris Elliott Art Gallery";
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
      .update({ ...updatedPainting, order: updatedPainting.order })
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
  };

  const togglePaintingSelection = (id: number) => {
    setSelectedPaintings((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((paintingId) => paintingId !== id)
        : [...prevSelected, id]
    );
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) {
      return;
    }

    let items = Array.from(filteredPaintings);
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

    // Update the order of the items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setPaintings((prevPaintings) => {
      const newPaintings = prevPaintings.map((painting) => {
        const updatedPainting = updatedItems.find(
          (item) => item.id === painting.id
        );
        return updatedPainting || painting;
      });
      return newPaintings.sort((a, b) => a.order - b.order);
    });

    // Save the new order to the database
    await updateOrder(updatedItems);
  };

  return (
    <div className="fade-in">
      <div className="px-3 sm:px-5 mt-14">
        <h1 className="text-6xl sm:text-7xl font-serif mt-32 mb-5">
          Admin Dashboard
        </h1>

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
        <div className="bg-white p-5 dashboard w-full mb-32">
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
                      <th>Title</th>
                      <th className="shift">Collection</th>
                      <th>Medium</th>
                      <th>Width</th>
                      <th>Height</th>
                      <th>Year</th>
                      <th>Price</th>
                      <th className="shift">Display Price</th>
                      <th className="shift">Purchased</th>
                      <th></th>
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
                            className={`${
                              !snapshot.isDragging &&
                              selectedPaintings.includes(painting.id) &&
                              "bg-gray-100"
                            } ${snapshot.isDragging && "bg-gray-100"}`}
                          >
                            <td
                              {...provided.dragHandleProps}
                              onClick={() =>
                                togglePaintingSelection(painting.id)
                              }
                            >
                              <MdDragIndicator className="text-xl cursor-move opacity-60" />
                            </td>
                            <td>
                              <img
                                className="h-12"
                                src={painting.photoS}
                                alt=""
                              />
                            </td>
                            <td>
                              <input
                                className="w-80 font-bold"
                                type="text"
                                value={painting.title}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <select
                                value={painting.collection}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "collection",
                                    e.target.value
                                  )
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
                                  handleChange(
                                    painting.id,
                                    "medium",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-14"
                                type="number"
                                value={painting.width || ""}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "width",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-14"
                                type="number"
                                value={painting.height || ""}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "height",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-28"
                                type="text"
                                value={painting.year || ""}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "year",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="w-20"
                                type="number"
                                value={painting.price || ""}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={painting.display_price}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "display_price",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={painting.purchased}
                                onChange={(e) =>
                                  handleChange(
                                    painting.id,
                                    "purchased",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td className="text-nowrap">
                              <button
                                className="icon save"
                                onClick={() => updatePainting(painting)}
                              >
                                <MdSave />
                              </button>
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
    </div>
  );
}

export default Admin;
