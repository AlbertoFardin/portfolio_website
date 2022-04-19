import IView from "./IView";

interface IViewGroup {
  id: string;
  title: string;
  items: IView[];
}

export default IViewGroup;
