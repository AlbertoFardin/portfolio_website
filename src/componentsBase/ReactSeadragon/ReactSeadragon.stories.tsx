import * as React from "react";
import ReactSeadragon from ".";
import FieldText from "../Field/FieldText";

// const defaultTileSources = 'http://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
const defaultTileSources =
  "https://openseadragon.github.io/example-images/pnp/pan/6a32000/6a32400/6a32487.dzi";

const DemoReactSeadragon = () => {
  const [url, setUrl] = React.useState(defaultTileSources);

  const onChange = React.useCallback((t) => {
    setUrl(t);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <FieldText
        label="Url dzi image"
        value={url}
        multiline
        style={{ width: 700, padding: 10 }}
        onChange={onChange}
      />
      <ReactSeadragon optionsSeadragon={{ tileSources: url }} />
    </div>
  );
};

export default {
  title: "Components/ReactSeadragon",
  component: ReactSeadragon,
};

const Story = () => <DemoReactSeadragon />;
export const Example = Story.bind({});
