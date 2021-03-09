const {
  amendTimeStamp,
  reformatData,
  createRefObject,
} = require("../db/utils/data-manipulation");

describe("amendTimeStamp", () => {
  it("return empty array when passed empty array ", () => {
    expect(amendTimeStamp([])).toEqual([]);
  });
  it("amendTimeStamp with single object", () => {
    const input = [
      {
        title: "The Notorious MSG’s Unlikely Formula For Success",
        topic: "cooking",
        author: "grumpy19",
        body:
          "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
        created_at: 1502921310430,
      },
    ];
    expect(amendTimeStamp(input)).toEqual([
      {
        title: "The Notorious MSG’s Unlikely Formula For Success",
        topic: "cooking",
        author: "grumpy19",
        body:
          "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
        created_at: new Date(1502921310430),
      },
    ]);
  });
  it("works on multiple array elements", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
    ];
    expect(amendTimeStamp(input)).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1416140514171),
      },
    ]);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        title: "The Notorious MSG’s Unlikely Formula For Success",
        topic: "cooking",
        author: "grumpy19",
        body:
          "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
        created_at: 1502921310430,
      },
    ];
    amendTimeStamp(input);
    expect(input).toEqual([
      {
        title: "The Notorious MSG’s Unlikely Formula For Success",
        topic: "cooking",
        author: "grumpy19",
        body:
          "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
        created_at: 1502921310430,
      },
    ]);
  });
});

describe("reformatData", () => {
  it("takes empty array, returns empty array", () => {
    expect(reformatData([])).toEqual([]);
  });

  it("changes keys of one array element", () => {
    const input = [
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        belongs_to: "Why do England managers keep making the same mistakes?",
        created_by: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
    ];
    const refObj = {
      "Why do England managers keep making the same mistakes?": 15,
    };
    expect(
      reformatData(
        input,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        refObj
      )
    ).toEqual([
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        article_id: 15,
        author: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
    ]);
  });

  it("changes keys of multiple array element", () => {
    const refObj = {
      "Why do England managers keep making the same mistakes?": 15,
      "Running a Node App": 1,
    };
    const input = [
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        belongs_to: "Why do England managers keep making the same mistakes?",
        created_by: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
      {
        body:
          "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
        belongs_to: "Running a Node App",
        created_by: "weegembump",
        votes: 11,
        created_at: 1454293795551,
      },
    ];
    expect(
      reformatData(
        input,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        refObj
      )
    ).toEqual([
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        article_id: 15,
        author: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
      {
        body:
          "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
        article_id: 1,
        author: "weegembump",
        votes: 11,
        created_at: 1454293795551,
      },
    ]);
  });

  it("does not mutate the original array", () => {
    const refObj = {
      "Why do England managers keep making the same mistakes?": 15,
    };
    const input = [
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        belongs_to: "Why do England managers keep making the same mistakes?",
        created_by: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
    ];
    reformatData(
      input,
      "created_by",
      "author",
      "belongs_to",
      "article_id",
      refObj
    );
    //console.log(input);
    expect(input).toEqual([
      {
        body:
          "Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.",
        belongs_to: "Why do England managers keep making the same mistakes?",
        created_by: "jessjelly",
        votes: 14,
        created_at: 1516202088630,
      },
    ]);
  });
  describe("createRefObj", () => {
    it("returns an object", () => {
      expect(createRefObject([])).toEqual({});
    });
    it("takes an array of a single element, returns a reference object of key-value pair", () => {
      const input = [
        {
          article_id: 34,
          title: "The Notorious MSG’s Unlikely Formula For Success",
          body:
            "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world’s most innovative chefs. But secret ingredient monosodium glutamate’s biggest secret may be that there was never anything wrong with it at all.",
          votes: 0,
          topic: "cooking",
          author: "grumpy19",
          created_at: new Date("2017-08-16T22:08:30.430Z"),
        },
      ];
      const expected = {
        "The Notorious MSG’s Unlikely Formula For Success": 34,
      };
      expect(createRefObject(input, "title", "article_id")).toEqual(expected);
    });
    it("works on multiple array of elements", () => {
      const input = [
        {
          article_id: 31,
          title: "What to Cook This Week",
          body:
            "Good morning. Here’s the plan for the week, not including breakfast because I’m on a farina kick and that’s not to everyone’s taste, and not including lunch because really when it comes to the midday hours you should get out of the office or the house and walk around. If you get something to eat, great, but the most important thing is to be outside where the stories are. There’s nothing happening at your desk but a screen. Anyway! I’m thinking chicken paprikash for dinner tonight, a nod toward the coming fall, served over buttery egg noodles, with green beans on the side. If you have the time, make an apple cake for dessert.",
          votes: 0,
          topic: "cooking",
          author: "tickle122",
          created_at: new Date("2017-11-05T07:22:43.519Z"),
        },
        {
          article_id: 32,
          title: "Halal food: Keeping pure and true",
          body:
            "CHINA’S cities abound with restaurants and food stalls catering to Muslims as well as to the many other Chinese who relish the distinctive cuisines for which the country’s Muslims are renowned. So popular are kebabs cooked by Muslim Uighurs on the streets of Beijing that the city banned outdoor grills in 2014 in order to reduce smoke, which officials said was exacerbating the capital’s notorious smog (the air today is hardly less noxious). Often such food is claimed to be qing zhen, meaning 'pure and true', or halal, prepared according to traditional Islamic regulations. But who can tell? Last year angry Muslims besieged a halal bakery in Xining, the capital of Qinghai province, after pork sausages were found in the shop’s delivery van. There have been several scandals in recent years involving rat meat or pork being sold as lamb. These have spread Muslim mistrust of domestically produced halal products.",
          votes: 0,
          topic: "cooking",
          author: "grumpy19",
          created_at: new Date("2017-08-16T07:47:21.660Z"),
        },
      ];
      expect(createRefObject(input, "title", "article_id")).toEqual({
        "What to Cook This Week": 31,
        "Halal food: Keeping pure and true": 32,
      });
    });
  });

  it("does not mutate original array of object", () => {
    const input = [
      {
        article_id: 31,
        title: "What to Cook This Week",
        body:
          "Good morning. Here’s the plan for the week, not including breakfast because I’m on a farina kick and that’s not to everyone’s taste, and not including lunch because really when it comes to the midday hours you should get out of the office or the house and walk around. If you get something to eat, great, but the most important thing is to be outside where the stories are. There’s nothing happening at your desk but a screen. Anyway! I’m thinking chicken paprikash for dinner tonight, a nod toward the coming fall, served over buttery egg noodles, with green beans on the side. If you have the time, make an apple cake for dessert.",
        votes: 0,
        topic: "cooking",
        author: "tickle122",
        created_at: new Date("2017-11-05T07:22:43.519Z"),
      },
    ];
    createRefObject(input, "title", "article_id");
    expect(input).toEqual([
      {
        article_id: 31,
        title: "What to Cook This Week",
        body:
          "Good morning. Here’s the plan for the week, not including breakfast because I’m on a farina kick and that’s not to everyone’s taste, and not including lunch because really when it comes to the midday hours you should get out of the office or the house and walk around. If you get something to eat, great, but the most important thing is to be outside where the stories are. There’s nothing happening at your desk but a screen. Anyway! I’m thinking chicken paprikash for dinner tonight, a nod toward the coming fall, served over buttery egg noodles, with green beans on the side. If you have the time, make an apple cake for dessert.",
        votes: 0,
        topic: "cooking",
        author: "tickle122",
        created_at: new Date("2017-11-05T07:22:43.519Z"),
      },
    ]);
  });
});
