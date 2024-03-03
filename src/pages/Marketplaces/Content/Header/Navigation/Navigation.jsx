import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsGrid, BsGrid3X3Gap } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { PiCoins } from "react-icons/pi";
import { VscListFilter } from "react-icons/vsc";
import { arrowDownUp } from "~/assets/Icon";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import Tooltip from "~/components/Tooltip";
import { setGlobalState, useGlobalState } from "~/store";
import DropDownSort from "./DropDownSort";
import styles from "./Navigation.module.sass";
const cx = classNames.bind(styles);

const Navigation = () => {
  const [showFilter] = useGlobalState("showFilter");
  const [WidthAndHeightWindow] = useGlobalState("WidthAndHeightWindow");
  const [showMarketplaceGridStyle] = useGlobalState("showMarketplaceGridStyle");
  const localMarketPlaceGridStyle = localStorage.getItem("marketplace-gridstyle");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    if (!localMarketPlaceGridStyle) {
      localStorage.setItem("marketplace-gridstyle", "grids");
      setGlobalState("showMarketplaceGridStyle", "grids");
    } else {
      setGlobalState("showMarketplaceGridStyle", localMarketPlaceGridStyle);
    }
  }, [localMarketPlaceGridStyle]);

  const items = [
    {
      id: 1,
      groups: [
        {
          id: "filter",
          name: "Traits Filter",
          type: "button",
          icon: VscListFilter,
          categories: "boolean",
          show: showFilter,
          showType: "showFilter",
          toolTip: true,
        },
      ],
    },
    {
      id: 2,
      groups: [
        {
          id: "grids",
          name: "girds",
          localStore: "marketplace-gridstyle",
          type: "button",
          show: showMarketplaceGridStyle === "grids",
          showType: "showMarketplaceGridStyle",
          icon: BsGrid3X3Gap,
        },
        {
          id: "grid",
          name: "grid",
          localStore: "marketplace-gridstyle",
          show: showMarketplaceGridStyle === "grid",
          showType: "showMarketplaceGridStyle",
          type: "button",
          icon: BsGrid,
        },
        {
          id: "list",
          localStore: "marketplace-gridstyle",
          name: "list",
          show: showMarketplaceGridStyle === "list",
          showType: "showMarketplaceGridStyle",
          type: "button",
          icon: AiOutlineUnorderedList,
        },
      ],
    },
    {
      id: 3,
      flex: true,
      groups: [
        {
          id: "search",
          name: "search",
          type: "input",
          placeHolder: "Search items",
          icon: IoSearchOutline,
        },
      ],
    },
    {
      id: 4,
      groups: [
        {
          id: "sort",
          name: "sort",
          type: "dropDown",
          data: [
            { name: "Price: Low to High", value: "low_to_high" },
            { name: "Price: High to Low", value: "high_to_low" },
            { name: "Inscription: Low to High", value: "inscription_low_to_high" },
            { name: "Inscription: High to Low", value: "inscription_high_to_low" },
            { name: "Recently", value: "recently" },
            { name: "Common to Rare", value: "common_to_rare" },
            { name: "Rare to Common", value: "rare_to_common" },
          ],
          icon: arrowDownUp,
        },
      ],
    },
    {
      id: 5,
      groups: [
        {
          id: "refresh",
          name: "Refresh",
          type: "button",
          icon: FiRefreshCw,
          toolTip: true,
        },
      ],
    },
  ];
  const [sortValue, setSortValue] = useState();

  const handleSort = (v) => {
    setSortValue(v);
  };

  const handleClickButton = (group) => {
    if (group.categories === "boolean") {
      setGlobalState(group?.showType, !group?.show);
      return;
    }

    if (group?.localStore) {
      localStorage.setItem(group?.localStore, group?.id);
      setGlobalState(group?.showType, group?.id);
      return;
    }
  };

  const ButtonNavigation = ({ group }) => {
    return (
      <>
        {group?.title ? (
          <Button className={cx("buttonNavigation")} classButton={cx("contentButtonNavigation")} xl fontMedium title={group?.title} backgroundGallery icon={group?.icon} size={20} onClick={() => handleClickButton(group?.showType, group?.show)} />
        ) : (
          <>
            <Button id={group?.id} className={cx("buttonNavigation")} onClick={() => handleClickButton(group)} background={group?.show} backgroundGallery={!group?.show} icon={group?.icon} size={20} />
          </>
        )}
      </>
    );
  };

  const InputNavigation = ({ group }) => {
    return (
      <div className={cx("wrapperSearch")}>
        <Button icon={group?.icon} size={20} backgroundGallery className={`${cx("buttonNavigation")} ${cx("buttonSearch")} ${searchActive ? cx("active") : ""}`} onClick={() => setSearchActive(true)} />
        <TextInput className={`${cx("inputSearch")} ${searchActive ? cx("active") : ""}`} classBorder={cx("borderInputSearch")} icon={group?.icon} sizeIcon={20} placeholder={group?.placeHolder} copy iconCopy={IoClose} onClickCopy={() => setSearchActive(false)} />
      </div>
    );
  };

  useEffect(() => {
    if (WidthAndHeightWindow.width < 768) {
      if (showMarketplaceGridStyle === "grids") {
        localStorage.setItem("marketplace-gridstyle", "grid");
        setGlobalState("showMarketplaceGridStyle", "grid");
      }
    }
  }, [WidthAndHeightWindow]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        {items.map((item, index) => (
          <div key={index} className={`${cx("wrapperContent")} ${searchActive ? cx("active") : ""}`}>
            {item?.groups.map((group, index) => (
              <div key={index} className={`${cx("wrapperGroups")} ${item?.groups.length > 1 ? cx("active") : ""} ${group?.show ? cx("show") : ""}`}>
                {group?.type === "button" && (
                  <>
                    {group?.toolTip ? (
                      <Tooltip content={group?.name} toolTip>
                        <div className={cx("wrapperButton")}>
                          <ButtonNavigation group={group} />
                        </div>
                      </Tooltip>
                    ) : (
                      <div className={cx("wrapperButton")}>
                        <ButtonNavigation group={group} />
                      </div>
                    )}
                  </>
                )}
                {group?.type === "dropDown" && <DropDownSort data={group.data} value={sortValue} onChange={handleSort} />}
                {group?.type === "input" && <InputNavigation group={group} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
