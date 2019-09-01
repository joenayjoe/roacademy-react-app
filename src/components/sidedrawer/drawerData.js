export default {
  items: [
    {
      id: 1,
      name: "Science Fun",
      url: "/url1"
    },
    {
      id: 2,
      name: "Grade School",
      url: "/url2",
      children: [
        {
          id: 3,
          name: "Grade 1",
          url: "/url2.1"
        },
        {
          id: 4,
          name: "Grade 2",
          url: "/url2.2",
          children: [
            {
              id: 5,
              name: "Physics",
              url: "/url2.2.1"
            },
            {
              id: 6,
              name: "Chemistry",
              url: "/url2.2.2"
            },
            {
              id: 7,
              name: "Mathematics",
              url: "/url2.2.1"
            }
          ]
        }
      ]
    },
    {
      id: 8,
      name: "English Tutorial",
      url: "/url3",
      children: [
        {
          id: 9,
          name: "Basic English Speaking",
          url: "/basic"
        },
        {
          id:10,
          name: "Intermediate English",
          url: "/inter"
        }
      ]
    }
  ]
}
