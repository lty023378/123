
import { Animal, Plant, TrashItem, FoodChain, SimLevel, SimTool, SimEntityType, TerrainType } from './types';

export const ANIMALS: Animal[] = [
  {
    id: 'frog',
    name: '黑斑蛙',
    description: '我是庄稼的卫士，专门吃害虫！',
    image: 'https://picsum.photos/id/1003/300/300', // Placeholder
    soundDescription: '呱... 呱... 呱...', // Pauses help TTS rhythm
    found: false,
    fact: '一只黑斑蛙一天能吃掉70多只害虫呢！'
  },
  {
    id: 'heron',
    name: '白鹭',
    description: '我是湿地的晴雨表，只有环境好我才来。',
    image: 'https://picsum.photos/id/1024/300/300',
    soundDescription: '嘎... 呃... 嘎... 呃...', // Raspy representation
    found: false,
    fact: '我们在飞行时，脖子会缩成一个“S”形哦。'
  },
  {
    id: 'cricket',
    name: '蟋蟀',
    description: '我喜欢躲在草丛里唱歌。',
    image: 'https://picsum.photos/id/1068/300/300',
    soundDescription: '瞿... 瞿... 瞿...', // Sharp, high pitched representation
    found: false,
    fact: '只有雄性蟋蟀才会通过摩擦翅膀发出叫声哦。'
  }
];

export const PLANTS: Plant[] = [
  { id: 'reed', name: '芦苇', role: '过滤杂质', power: 10 },
  { id: 'iris', name: '黄菖蒲', role: '吸收重金属', power: 25 },
  { id: 'vallisneria', name: '苦草', role: '增加氧气', power: 15 },
  { id: 'lotus', name: '荷花', role: '净化水体', power: 20 },
];

export const STORY_INTRO = [
  "你好呀，小侦探！我是熊畈村的守护神——水龙。",
  "我们的湿地生病了，水变得浑浊，小动物们都躲起来了。",
  "你需要完成三个任务来恢复湿地的生机！",
  "准备好了吗？让我们出发吧！"
];

export const TRASH_ITEMS: TrashItem[] = [
  { id: 'bottle', name: '塑料瓶', emoji: '🥤', type: 'recycle' },
  { id: 'battery', name: '废电池', emoji: '🔋', type: 'harmful' },
  { id: 'apple', name: '苹果核', emoji: '🍎', type: 'organic' },
  { id: 'can', name: '易拉罐', emoji: '🥫', type: 'recycle' },
  { id: 'paper', name: '旧报纸', emoji: '📰', type: 'recycle' },
  { id: 'paint', name: '油漆桶', emoji: '🎨', type: 'harmful' },
];

export const FOOD_CHAINS: FoodChain[] = [
  {
    id: 1,
    description: "稻田里的守卫战",
    items: [
      { id: 'rice', name: '水稻', emoji: '🌾' },
      { id: 'pest', name: '害虫', emoji: '🐛' },
      { id: 'frog', name: '青蛙', emoji: '🐸' }
    ]
  },
  {
    id: 2,
    description: "水下的秘密",
    items: [
      { id: 'algae', name: '藻类', emoji: '🦠' },
      { id: 'shrimp', name: '小虾', emoji: '🦐' },
      { id: 'fish', name: '大鱼', emoji: '🐟' }
    ]
  }
];

// --- Eco Sim Constants ---

export const SIM_TOOLS: SimTool[] = [
  { id: 'clean', name: '清理/铲除', emoji: '🧹', cost: 20, description: '清理垃圾(+分)或铲除植物' },
  { id: 'grass', name: '苦草', emoji: '🌿', cost: 50, description: '【生产者】只能种在深水区' },
  { id: 'lotus', name: '荷花', emoji: '🌺', cost: 80, description: '【生产者】喜水，需旁边有苦草' },
  { id: 'carp', name: '红鲤鱼', emoji: '🐟', cost: 60, description: '【消费者】深水，需旁边有植物' },
  { id: 'frog', name: '泽蛙', emoji: '🐸', cost: 40, description: '【益虫】吃掉害虫赚赏金(+100)' },
  { id: 'heron', name: '小白鹭', emoji: '🦢', cost: 100, description: '【消费者】浅水/岸边，需旁边有鱼' },
  { id: 'stork', name: '东方白鹳', emoji: '🦩', cost: 150, description: '【顶级掠食】岸边，需旁边有2条鱼' },
];

export const SIM_LEVELS: SimLevel[] = [
  {
    id: 1,
    budget: 400,
    missionDescription: "清理这片被污染的水域，恢复生机。",
    missionTarget: [{ type: 'grass', count: 2 }, { type: 'frog', count: 1 }],
    initialGrid: [
        // 4x4 Grid preset. Default terrain is implied if not listed, but we will fill dynamically.
        // Here we define overrides.
        { row: 0, col: 0, terrain: 'deep_water', entity: 'trash' },
        { row: 0, col: 1, terrain: 'deep_water' },
        { row: 0, col: 2, terrain: 'shallow_water' },
        { row: 0, col: 3, terrain: 'land' },
        
        { row: 1, col: 0, terrain: 'deep_water', entity: 'trash' },
        { row: 1, col: 1, terrain: 'deep_water' },
        { row: 1, col: 2, terrain: 'shallow_water', entity: 'bug' },
        { row: 1, col: 3, terrain: 'land' },

        { row: 2, col: 0, terrain: 'deep_water' },
        { row: 2, col: 1, terrain: 'shallow_water', entity: 'snail' },
        { row: 2, col: 2, terrain: 'shallow_water' },
        { row: 2, col: 3, terrain: 'land' },

        { row: 3, col: 0, terrain: 'shallow_water' },
        { row: 3, col: 1, terrain: 'shallow_water' },
        { row: 3, col: 2, terrain: 'land' },
        { row: 3, col: 3, terrain: 'land' },
    ]
  },
  {
    id: 2,
    budget: 600,
    missionDescription: "建立一个完整的食物链，吸引白鹭定居。",
    missionTarget: [{ type: 'heron', count: 1 }, { type: 'carp', count: 2 }],
    initialGrid: [
        { row: 0, col: 0, terrain: 'deep_water' },
        { row: 0, col: 1, terrain: 'deep_water', entity: 'trash' },
        { row: 0, col: 2, terrain: 'deep_water' },
        { row: 0, col: 3, terrain: 'shallow_water' },
        
        { row: 1, col: 0, terrain: 'deep_water' },
        { row: 1, col: 1, terrain: 'deep_water' },
        { row: 1, col: 2, terrain: 'shallow_water' },
        { row: 1, col: 3, terrain: 'shallow_water' },

        { row: 2, col: 0, terrain: 'shallow_water', entity: 'snail' },
        { row: 2, col: 1, terrain: 'shallow_water' },
        { row: 2, col: 2, terrain: 'land' },
        { row: 2, col: 3, terrain: 'land', entity: 'bug' },

        { row: 3, col: 0, terrain: 'land' },
        { row: 3, col: 1, terrain: 'land' },
        { row: 3, col: 2, terrain: 'land' },
        { row: 3, col: 3, terrain: 'land' },
    ]
  }
];

export const PLACEMENT_RULES: Record<string, { terrain: TerrainType[], needs?: { type: SimEntityType | 'plant' | 'fish', count: number, range: number } }> = {
    grass: { terrain: ['deep_water'] },
    lotus: { terrain: ['deep_water', 'shallow_water'], needs: { type: 'grass', count: 1, range: 1 } },
    carp: { terrain: ['deep_water'], needs: { type: 'plant', count: 1, range: 1 } },
    frog: { terrain: ['land', 'shallow_water'] },
    heron: { terrain: ['land', 'shallow_water'], needs: { type: 'fish', count: 1, range: 1 } },
    stork: { terrain: ['land'], needs: { type: 'fish', count: 2, range: 1 } }
};
