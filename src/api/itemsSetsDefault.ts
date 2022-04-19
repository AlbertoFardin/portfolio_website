export default (items: { id: string }[] = []) => [
  {
    id: "default",
    label: "Default Set",
    active: true,
    default: true,
    items,
  },
];
