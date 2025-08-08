import { supabase } from "../supabase";
import { Collection, Content, Painting } from "../types";
import { stringToUrl } from "./utils";

/**
 * Fetches unique collections from the "paintings" table in Supabase.
 * @returns Promise resolving to an array of Collection objects.
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    // Fetch paintings data from Supabase, ordered by `order` ascending
    const { data, error } = await supabase
      .from("paintings")
      .select("collection, order, photoM")
      .order("order", { ascending: true });

    // Handle query errors
    if (error) throw error;
    if (!data) return [];

    // Use a Map to track unique collections
    const collectionsMap = data.reduce((acc, { collection, photoM }) => {
      // Only add if this collection name hasn't been seen yet
      if (!acc.has(collection)) {
        acc.set(collection, {
          name: collection,
          url: stringToUrl(collection),
          photo: photoM || "",
        });
      }
      return acc;
    }, new Map());
    return [...collectionsMap.values()];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

/**
 * Fetches paintings from the "paintings" table in Supabase.
 * @returns Promise resolve to an array of Painting objects.
 */
export const getPaintings = async (): Promise<Painting[]> => {
  const { data, error } = await supabase.from("paintings").select("*");
  if (error) {
    console.error("Error fetching data:", error);
    return [];
  } else {
    data.sort((a, b) => a.order - b.order);
    return data;
  }
};

/**
 * Gets collections from an array of Painting objects.
 * @param paintings Input paintings
 * @returns An array of Collection objects.
 */
export const getCollectionsFromPaintings = (paintings: Painting[]): Collection[] => {
  const uniqueCollections = [...new Set(paintings.map((painting) => painting.collection))];
  let collections: Collection[] = [
    {
      name: "All Paintings",
      url: "all",
      photo: "",
    },
  ];
  collections = collections.concat(
    uniqueCollections.map((collectionName) => {
      const collectionPaintings = paintings.filter(
        (painting) => painting.collection === collectionName
      );
      return {
        name: collectionName,
        url: stringToUrl(collectionName),
        photo: collectionPaintings[0]?.photoS || "",
      };
    })
  );
  return collections;
}

export const getContent = async (page: string, name: string): Promise<string> => {
  const { data, error } = await supabase.from("content").select("content").eq("page", page).eq("name", name).single();
  if (error) {
    console.error("Error fetching data:", error);
    return "";
  } else {
    return data.content;
  }
}

export const getAllContent = async (): Promise<Content[]> => {
  const { data, error } = await supabase.from("content").select("*");
  if (error) {
    console.error("Error fetching data:", error);
    return [];
  } else {
    return data;
  }
}

export const saveContent = async (contents: Content[]): Promise<string> => {
  try {
    const { error } = await supabase
      .from("content")
      .upsert(contents);
    if (error) throw error;
    return "Saved successfully!";
  } catch (error) {
    console.error("Error updating content array:", error);
    return "Failed to save changes!";
  }
}