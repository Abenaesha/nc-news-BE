const {
  amendTimeStamp,
  ammendCommentsFormat,
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

  describe("ammendCommentsFormat", () => {
    it("return empty array when passed empty array ", () => {
      expect(ammendCommentsFormat([])).toEqual([]);
    });
    it.only("changes created_by to author", () => {
      const input = [
        {
          body:
            "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
          belongs_to: "Making sense of Redux",
          created_by: "grumpy19",
          votes: 7,
          created_at: 1478813209256,
        },
      ];
      expect(amendTimeStamp(input, "created_by", "author")).toEqual([
        {
          body:
            "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
          belongs_to: "Making sense of Redux",
          author: "grumpy19",
          votes: 7,
          created_at: new Date(1478813209256),
        },
      ]);
    });
  });
});
