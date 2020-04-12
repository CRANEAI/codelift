import { useEffect, useRef, useState } from "react";
import { useStore, observer } from "../../store";

export const ComponentInspector = observer(() => {
  const ref = useRef(null);
  const store = useStore();
  const selected = store.selected;
  const type = selected?.instance.type;
  const Inspector = type.Inspector;
  const props = selected?.props;

  useEffect(
    function renderInspector() {
      if (!ref.current || !Inspector || !store.contentWindow || !selected) {
        return;
      }

      // Use host's React/ReactDOM from register
      const { React, ReactDOM } = store.contentWindow as any;

      // Use Component's copy of React & ReactDOM so that hooks work
      ReactDOM.render(
        React.createElement(Inspector, {
          // Re-render inspector when it's reset to override `defaultValue`
          key: selected.props === selected.originalProps,
          props,
          setProps: selected.previewProps,
        }),
        ref.current
      );
    },
    [ref.current, props, Inspector]
  );

  if (!Inspector && store.selected?.isUserCode) {
    return (
      <button
        className="self-center border px-2 bg-green-500 border-green-300 shadow py-px hover:bg-green-400"
        onClick={() => store.selected?.openInIDE()}
      >
        Open in IDE
      </button>
    );
  }

  return <section ref={ref} />;
});
