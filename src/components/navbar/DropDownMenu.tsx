import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isMobile } from "react-device-detect";
import DropDown from "../dropdown/DropDown";
import {
  ICategory,
  IGrade,
  ICourse,
  MenuItemType
} from "../../settings/DataTypes";
import { withRouter, RouteComponentProps } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { GradeService } from "../../services/GradeService";
import { isGrade, isCourse } from "../../utils/typeChecker";
import Spinner from "../spinner/Spinner";
import {
  BUILD_GRADE_URL,
  BUILD_COURSE_URL,
  BUILD_CATEGORY_URL
} from "../../settings/Constants";
import { CourseService } from "../../services/CourseService";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {
  displayName: string;
  icon?: IconProp;
}

const DropDownMenu: React.FunctionComponent<IProps> = props => {
  // api services
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  // states
  const [showDropDownMenu, setShowDropDownMenu] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null
  );
  const [levelTwoParent, setLevelTwoParent] = useState<MenuItemType | null>(
    null
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showLgScreenDropDownMenu, setShowLgScreenDropDownMenu] = useState<
    boolean
  >(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);
  const [isLoadingGrade, setIsLoadingGrade] = useState<boolean>(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState<boolean>(false);

  // refs
  let menuBtnNode = useRef<HTMLButtonElement>(null);
  let menuNode = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setIsLoadingCategory(true);
    categoryService.getCategories("name_asc").then(response => {
      setCategories(response.data);
      setIsLoadingCategory(false);
    });
    document.addEventListener("mousedown", e => handleOnClick(e), false);

    return () => {
      document.removeEventListener("mousedown", e => handleOnClick(e), false);
    };
    // eslint-disable-next-line
  }, []);

  const loadPage = (item: MenuItemType) => {
    let url: string;

    if (isCourse(item)) {
      url = BUILD_COURSE_URL(item.id);
    } else if (isGrade(item)) {
      url = BUILD_GRADE_URL(item.id);
    } else {
      url = BUILD_CATEGORY_URL(item.id);
    }

    setShowLgScreenDropDownMenu(false);
    setShowDropDownMenu(false);
    props.history.push(url);
  };

  const handleMenuItemMouseEnter = (item: MenuItemType) => {
    if (isCourse(item)) {
      loadPage(item);
    } else if (isGrade(item)) {
      fetchCoursesForGrade(item as IGrade);
    } else {
      fetchGradesForCategory(item as ICategory);
    }
  };

  const handleMenuLinkClick = (e: React.MouseEvent, item: MenuItemType) => {
    e.preventDefault();
    if (isMobile) {
      if (isCourse(item)) {
        loadPage(item);
      } else if (isGrade(item)) {
        const grade = item as IGrade;
        let parent: ICategory | null = null;
        for (let cat of categories) {
          if (cat.id === grade.primaryCategory.id) {
            parent = cat;
            break;
          }
        }
        fetchCoursesForGrade(grade);

        setLevelTwoParent(parent);
      } else {
        fetchGradesForCategory(item as ICategory);
      }

      setSelectedMenuItem(item);
    } else {
      loadPage(item);
    }
  };

  const handleBackBtnClick = () => {
    const ltp = levelTwoParent;
    setSelectedMenuItem(ltp);
    setLevelTwoParent(null);
  };

  const fetchGradesForCategory = (category: ICategory) => {
    setIsLoadingGrade(true);
    gradeService.getGradesByCategoryId(category.id, "id_asc").then(resp => {
      let updated_cats: ICategory[] = categories.map((cat: ICategory) => {
        if (cat.id === category.id) {
          cat.grades = resp.data;
        }
        return cat;
      });
      setCategories(updated_cats);
      setIsLoadingGrade(false);
    });
  };
  const fetchCoursesForGrade = (grade: IGrade) => {
    setIsLoadingCourse(true);
    courseService.getAllCoursesByGradeId(grade.id).then(resp => {
      let updated_cats = categories.map(cat => {
        if (cat.id === grade.primaryCategory.id) {
          cat.grades.map(grd => {
            if (grd.id === grade.id) {
              grd.courses = resp.data;
            }
            return grd;
          });
        }
        return cat;
      });
      setCategories(updated_cats);
      setIsLoadingCourse(false);
    });
  };

  const handleDropDownMouseEnter = () => {
    setShowLgScreenDropDownMenu(true);
  };

  const handleOnClick = (e: MouseEvent) => {
    if (
      menuBtnNode &&
      menuBtnNode.current &&
      menuBtnNode.current.contains(e.target as HTMLElement)
    ) {
      setShowDropDownMenu(!showDropDownMenu);
    } else if (
      !isMobile ||
      (isMobile &&
        !(
          menuNode &&
          menuNode.current &&
          menuNode.current.contains(e.target as HTMLElement)
        ))
    ) {
      setShowDropDownMenu(false);
    }
  };

  const dropDownMenuLevelThree = (data: IGrade) => {
    let dropDownMenuItem = data.courses.map((item: ICourse) => {
      return (
        <li key={item.id} className="drop-down-list-item">
          <Link
            to={BUILD_COURSE_URL(item.id)}
            className="menu-link"
            onClick={e => handleMenuLinkClick(e, item)}
          >
            <span>{item.name}</span>
          </Link>
        </li>
      );
    });

    return (
      <ul className="drop-down-list drop-down-list-level-three">
        {isMobile ? (
          <li
            key="back-l-3"
            className="drop-down-list-item back-menu-link"
            onClick={handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-list-item">
          <Link
            className="menu-link"
            to={BUILD_GRADE_URL(data.id)}
            onClick={() => loadPage(data)}
          >
            <span>All {data.name}</span>
          </Link>
        </li>
        {isLoadingCourse ? <Spinner /> : dropDownMenuItem}
      </ul>
    );
  };

  const dropDownMenuLevelTwo = (data: ICategory) => {
    let dropDownMenuItem = data.grades.map((item: IGrade) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        levelTwoParent === data && selectedMenuItem === item
          ? "open-sub-menu"
          : "";
      expander = (
        <span>
          <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
        </span>
      );

      submenu = dropDownMenuLevelThree(item);

      return (
        <li
          key={item.id}
          className={`drop-down-list-item ${openKlass}`}
          onMouseEnter={() => handleMenuItemMouseEnter(item)}
        >
          <Link
            className="menu-link"
            to={BUILD_GRADE_URL(item.id)}
            onClick={e => handleMenuLinkClick(e, item)}
          >
            <span>{item.name}</span>
            {expander}
          </Link>
          {submenu}
        </li>
      );
    });

    return (
      <ul className="drop-down-list drop-down-list-level-two">
        {isMobile ? (
          <li
            key="back-l-2"
            className="drop-down-list-item back-menu-link"
            onClick={handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-list-item">
          <Link
            className="menu-link"
            to={BUILD_CATEGORY_URL(data.id)}
            onClick={() => loadPage(data)}
          >
            <span> All {data.name}</span>
          </Link>
        </li>
        {isLoadingGrade ? <Spinner /> : dropDownMenuItem}
      </ul>
    );
  };

  const dropDownMenuLevelOne = (data: ICategory[]) => {
    let dropDownMenuItem = data.map((item: ICategory) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        selectedMenuItem === item || levelTwoParent === item
          ? "open-sub-menu"
          : "";
      expander = (
        <span>
          <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
        </span>
      );

      submenu = dropDownMenuLevelTwo(item);

      return (
        <li
          key={item.id}
          className={`drop-down-list-item ${openKlass}`}
          onMouseEnter={() => handleMenuItemMouseEnter(item)}
        >
          <Link
            className="menu-link"
            to={BUILD_CATEGORY_URL(item.id)}
            onClick={e => handleMenuLinkClick(e, item)}
          >
            <span>{item.name}</span>
            {expander}
          </Link>
          {submenu}
        </li>
      );
    });

    let disPlayKlass = showLgScreenDropDownMenu ? "" : "d-none";
    return (
      <ul
        className={`drop-down-list drop-down-list-level-one drop-down-list-arrow-left ${disPlayKlass}`}
        ref={menuNode}
      >
        {isLoadingCategory ? <Spinner classNames="pt-4" /> : dropDownMenuItem}
      </ul>
    );
  };

  return (
    <DropDown
      name="Categories"
      classNames="drop-down-on-hover"
      showDropDown={showDropDownMenu}
      icon={props.icon}
      dropDownBtnRef={menuBtnNode}
      handleMouseEnter={handleDropDownMouseEnter}
    >
      {dropDownMenuLevelOne(categories)}
    </DropDown>
  );
};
export default withRouter(DropDownMenu);
