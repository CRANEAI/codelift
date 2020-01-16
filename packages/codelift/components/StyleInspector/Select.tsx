import { capitalize } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";
import { ICSSRule } from "../../models/CSSRule";

type SelectProps = {
  label: string | JSX.Element;
  rules: ICSSRule[];
};

const translate = (className: string) => {
  const [, suffix] = className.split("-");

  switch (suffix) {
    case undefined:
      return "Default";
    case "md":
      return "Medium";
    case "lg":
      return "Large";
    case "xl":
      return "X-Large";
    case "2xl":
      return "XX-Large";
    default:
      return capitalize(suffix);
  }
};

export const Select: FunctionComponent<SelectProps> = observer(
  ({ label, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();
    const selected = rules.find(rule => rule.isApplied);
    const previewedRule = store.selected?.element?.previewedRule;

    if (previewedRule && rules.includes(previewedRule)) {
      label = <code>{previewedRule?.className}</code>;
    }

    return (
      <Menu label={label} selected={selected}>
        <ul>
          {rules.map(rule => (
            <li
              className={`flex items-center px-3 h-8 text-black text-xs hover:bg-gray-200 ${
                rule.isApplied ? "font-bold" : "font-normal"
              } ${res.fetching ? "cursor-wait" : "cursor-pointer"}`}
              key={rule.className}
              onMouseLeave={() => store.selected?.element?.cancelPreview()}
              onMouseOver={() => store.selected?.element?.previewRule(rule)}
              onClick={updateClassName}
              value={rule.className}
            >
              {translate(rule.className)}
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);
