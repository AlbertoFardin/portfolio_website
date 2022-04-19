import { v4 as uuidv4 } from "uuid";

const createItem = (label: string): { id: string; label: string } => ({
  id: uuidv4(),
  label,
});

export default createItem;
