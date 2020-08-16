import React, { useState, useEffect } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { ICategory, ICourse, IGrade } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";

import CourseSlide from "../course/CourseSlide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import { isMobile } from "react-device-detect";
import { CourseService } from "../../services/CourseService";
import { DEFAULT_COURSE_STATUS } from "../../settings/Constants";
import GradeSlide from "../grade/GradeSlide";
import { GradeService } from "../../services/GradeService";
import DonationBanner from "../../components/banner/DonationBanner";
import Spinner from "../../components/spinner/Spinner";

const Home: React.FunctionComponent = () => {
  // services
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  // states
  // category courses
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [categoryCourses, setCategoryCourses] = useState<ICourse[]>([]);
  const [categoryCoursesPageNumber, setCategoryCoursesPageNumber] = useState<
    number
  >(0);
  const [hasMoreCategoryCourses, setHasMoreCategoryCourses] = useState<boolean>(
    false
  );
  const [
    lastCategoryCourseSlideIndex,
    setLastCategoryCourseSlideIndex,
  ] = useState<number>(0);
  const [isCategoryCourseLoading, setIsCategoryCourseLoading] = useState<
    boolean
  >(true);

  // trending course states
  const [trendingCourses, setTrendingCourses] = useState<ICourse[]>([]);
  const [hasMoreTrendingCourse, setHasMoreTrendingCourse] = useState<boolean>(
    false
  );
  const [trendingCoursePageNumber, setTrendingCoursePageNumber] = useState<
    number
  >(0);
  const [
    lastTrendingCourseSlideIndex,
    setLastTrendingCourseSlideIndex,
  ] = useState<number>(0);
  const [isTrendingCourseLoading, setIsTrendingCourseLoading] = useState<
    boolean
  >(true);

  // new courses states
  const [newCourses, setNewCourses] = useState<ICourse[]>([]);
  const [hasMoreNewCourse, setHasMoreNewCourse] = useState<boolean>(false);
  const [newCoursePageNumber, setNewCoursePageNumber] = useState<number>(0);
  const [lastNewCourseSlideIndex, setLastNewCourseSlideIndex] = useState<
    number
  >(0);
  const [isNewCoursesLoading, setIsNewCoursesLoading] = useState<boolean>(true);

  // popular topic states
  const [popularTopics, setPopularTopics] = useState<IGrade[]>([]);
  const [hasMorePopularTopics, setHasMorePopularTopics] = useState<boolean>(
    false
  );
  const [popularTopicPageNumber, setPopularTopicPageNumber] = useState<number>(
    0
  );
  const [lastPopularTopicSlideIndex, setLastPopularTopicSlideIndex] = useState<
    number
  >(0);
  const [isPopularTopicLoading, setIsPopularTopicLoading] = useState<boolean>(
    true
  );

  const loadCategories = () => {
    categoryService.getCategories("name_asc").then((resp) => {
      setCategories(resp.data);
      if (resp.data.length) {
        setSelectedCategoryId(resp.data[0].id);
      }
    });
  };
  const loadCategoryCourses = (categoryId: number, page: number, size = 10) => {
    setIsCategoryCourseLoading(true);
    courseService
      .getCoursesByCategoryId(categoryId, page, size)
      .then((resp) => {
        setCategoryCourses(categoryCourses.concat(resp.data.content));
        setIsCategoryCourseLoading(false);
        if (resp.data.last) {
          setHasMoreCategoryCourses(false);
        } else {
          setHasMoreCategoryCourses(true);
        }
      });
  };

  const loadTrendingCourses = (page: number, size = 10) => {
    setIsTrendingCourseLoading(true);
    courseService
      .getCourses(page, size, DEFAULT_COURSE_STATUS, "hits_desc")
      .then((resp) => {
        setTrendingCourses(trendingCourses.concat(resp.data.content));
        setIsTrendingCourseLoading(false);
        if (resp.data.last) {
          setHasMoreTrendingCourse(false);
        } else {
          setHasMoreTrendingCourse(true);
        }
      });
  };

  const loadNewCourses = (page: number, size = 10) => {
    setIsNewCoursesLoading(true);
    courseService
      .getCourses(page, size, DEFAULT_COURSE_STATUS, "createdAt_desc")
      .then((resp) => {
        setNewCourses(newCourses.concat(resp.data.content));
        setIsNewCoursesLoading(false);
        if (resp.data.last) {
          setHasMoreNewCourse(false);
        } else {
          setHasMoreNewCourse(true);
        }
      });
  };

  const loadPopularTopics = (page: number, size = 15) => {
    setIsPopularTopicLoading(true);
    gradeService.getGrades(page, size, "name_asc").then((resp) => {
      setPopularTopics(popularTopics.concat(resp.data.content));
      setIsPopularTopicLoading(false);
      if (resp.data.last) {
        setHasMorePopularTopics(false);
      } else {
        setHasMorePopularTopics(true);
      }
    });
  };

  useEffect(() => {
    if (selectedCategoryId > 0) {
      loadCategoryCourses(selectedCategoryId, 0);
    }
    // eslint-disable-next-line
  }, [selectedCategoryId]);

  useEffect(() => {
    loadCategories();
    loadTrendingCourses(0);
    loadNewCourses(0);
    loadPopularTopics(0);
    // eslint-disable-next-line
  }, []);

  const loadNextCategoryCoursePage = () => {
    const nextPageNumber = categoryCoursesPageNumber + 1;
    loadCategoryCourses(selectedCategoryId, nextPageNumber);
    setCategoryCoursesPageNumber(nextPageNumber);
  };

  const loadNextTrendingCoursePage = () => {
    const nextPage = trendingCoursePageNumber + 1;
    loadTrendingCourses(nextPage);
    setTrendingCoursePageNumber(nextPage);
  };

  const loadNextNewCoursePage = () => {
    const nextPage = newCoursePageNumber + 1;
    loadNewCourses(nextPage);
    setNewCoursePageNumber(nextPage);
  };

  const loadNextPopulatTopicPage = () => {
    const nextPage = popularTopicPageNumber + 1;
    loadPopularTopics(nextPage);
    setPopularTopicPageNumber(nextPage);
  };

  const handleCategoryCourseSlideAfterChangeEvent = (current: number) => {
    if (
      lastCategoryCourseSlideIndex < current &&
      categoryCourses.length - current <= 5 &&
      hasMoreCategoryCourses
    ) {
      loadNextCategoryCoursePage();
      setLastCategoryCourseSlideIndex(current);
    }
  };

  const handleTrendingCourseSlideAfterChangeEvent = (current: number) => {
    if (
      lastTrendingCourseSlideIndex < current &&
      trendingCourses.length - current <= 5 &&
      hasMoreTrendingCourse
    ) {
      loadNextTrendingCoursePage();
      setLastTrendingCourseSlideIndex(current);
    }
  };

  const handleNewCourseSlideAfterChangeEvent = (current: number) => {
    if (
      lastNewCourseSlideIndex < current &&
      newCourses.length - current <= 5 &&
      hasMoreNewCourse
    ) {
      loadNextNewCoursePage();
      setLastNewCourseSlideIndex(current);
    }
  };

  const handlePopulatTopicSlideAfterChangeEvent = (current: number) => {
    if (
      lastPopularTopicSlideIndex < current &&
      popularTopics.length - current * 2 <= 5 &&
      hasMorePopularTopics
    ) {
      loadNextPopulatTopicPage();
      setLastPopularTopicSlideIndex(current);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId);
      setCategoryCourses([]);
      setCategoryCoursesPageNumber(0);
      setHasMoreCategoryCourses(false);
      setLastCategoryCourseSlideIndex(0);
    }
  };

  const getCollapsibleCourses = (category: ICategory) => {
    if (selectedCategoryId === category.id) {
      return (
        <Collapse isOpen={selectedCategoryId === category.id}>
          <CourseSlide
            key={category.name}
            courses={categoryCourses}
            hasMore={hasMoreCategoryCourses}
            slideAfterChangeHandler={(currentSlide) =>
              handleCategoryCourseSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextCategoryCoursePage}
          />
        </Collapse>
      );
    }
    return null;
  };

  const getDesktopCategoryCourseView = () => {
    return categories.length ? (
      <div className="width-75 category-courses mb-2">
        <ul className="nav nav-pills">{categoryPill()}</ul>

        <div className="category-pill-content-container mt-2">
          <CourseSlide
            key={selectedCategoryId}
            courses={categoryCourses}
            hasMore={hasMoreCategoryCourses}
            slideAfterChangeHandler={(currentSlide) =>
              handleCategoryCourseSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextCategoryCoursePage}
          />
        </div>
      </div>
    ) : null;
  };
  const getMobileCategoryCourseView = () => {
    return categories.map((category) => {
      return (
        <div key={category.name} className="collapse-menu-item">
          <div
            className="collapse-item-header"
            onClick={() => handleCategoryClick(category.id)}
          >
            <span>{category.name}</span>
            <span>
              <FontAwesomeIcon
                icon={
                  selectedCategoryId === category.id ? "angle-up" : "angle-down"
                }
              />
            </span>
          </div>
          {getCollapsibleCourses(category)}
        </div>
      );
    });
  };
  const categoryPill = () => {
    return categories.map((cat) => {
      const className = selectedCategoryId === cat.id ? "active" : "";
      return (
        <li
          key={cat.name}
          className={`nav-link link ${className}`}
          onClick={() => handleCategoryClick(cat.id)}
        >
          {cat.name}
        </li>
      );
    });
  };

  const getCategoryCourses = () => {
    if (isMobile) {
      return (
        <div className="collapse-menu">{getMobileCategoryCourseView()}</div>
      );
    }
    return getDesktopCategoryCourseView();
  };

  const getTrendingCourses = () => {
    return (
      <CourseSlide
        title="Trending Courses"
        courses={trendingCourses}
        hasMore={hasMoreTrendingCourse}
        slideAfterChangeHandler={(current) => {
          handleTrendingCourseSlideAfterChangeEvent(current);
        }}
        loadNextPage={loadNextTrendingCoursePage}
      />
    );
  };

  const getNewCourses = () => {
    return (
      <CourseSlide
        title="New Courses"
        courses={newCourses}
        hasMore={hasMoreNewCourse}
        slideAfterChangeHandler={(current) =>
          handleNewCourseSlideAfterChangeEvent(current)
        }
        loadNextPage={loadNextNewCoursePage}
      />
    );
  };

  const getPoplarTopics = () => {
    return (
      <GradeSlide
        title="Popular Topics"
        grades={popularTopics}
        hasMore={hasMorePopularTopics}
        slideAfterChangeHandler={(current) =>
          handlePopulatTopicSlideAfterChangeEvent(current)
        }
        loadNextPage={loadNextPopulatTopicPage}
      />
    );
  };

  return (
    <React.Fragment>
      <TeacherRecruitBanner />
      {isCategoryCourseLoading ? <Spinner size="3x" /> : getCategoryCourses()}
      <div className="width-75 trending-courses mb-2">
        {isTrendingCourseLoading ? <Spinner size="3x" /> : getTrendingCourses()}
      </div>
      <div className="width-75 new-courses mb-2">
        {isNewCoursesLoading ? <Spinner size="3x" /> : getNewCourses()}
      </div>
      <div className="width-75 popular-topics mb-2">
        {isPopularTopicLoading ? <Spinner size="3x" /> : getPoplarTopics()}
      </div>
      <DonationBanner />
    </React.Fragment>
  );
};
export default Home;
