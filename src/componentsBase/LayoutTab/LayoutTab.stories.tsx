import * as React from "react";
import Typography from "@material-ui/core/Typography";
import LayoutTab from ".";

const DemoLayoutTab = () => {
  const [childrenSelectedId, setChildrenSelectedId] = React.useState("tab_1");
  const onSelectChildren = React.useCallback(
    (id) => setChildrenSelectedId(id),
    []
  );
  return (
    <LayoutTab
      panelSelectedId={childrenSelectedId}
      panels={[1, 2, 3, 4, 5].map((x) => ({
        id: `tab_${x}`,
        tooltip: `tooltip_tab_${x}`,
        children: (
          <div>
            <Typography
              variant="subtitle2"
              style={{ padding: 10, textAlign: "center" }}
              children={x}
            />
            <div style={{ height: 500 }} />
            <Typography
              variant="subtitle2"
              style={{ padding: 10, textAlign: "center" }}
              children="END"
            />
          </div>
        ),
      }))}
      onChange={onSelectChildren}
    />
  );
};

export default {
  title: "Components/LayoutTab",
  component: LayoutTab,
};

const Story = (args) => <DemoLayoutTab {...args} />;
export const Default = Story.bind({});
