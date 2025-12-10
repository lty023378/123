
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SimCell } from '../types';

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export interface NewsData {
  headline: string;
  body: string;
  interview: string;
}

export const generateDragonResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) return "哎呀，我的魔法失效了（缺少API Key）！";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `
          你现在扮演中国武汉市熊畈村的湿地守护神“水龙”（一条可爱的卡通龙）。
          你的对话对象是6-10岁的小朋友。
          
          你的性格：
          1. 活泼、可爱、充满鼓励。
          2. 使用简单的语言，避免过于深奥的专业术语，如果用到专业术语（如生态系统、富营养化），请用比喻解释。
          3. 经常使用emoji表情 🐉🌿💧。
          4. 你的知识库基于“湿地景观生态学”，重点关注水质净化、生物多样性保护。
          
          当小朋友问问题时，你要用有趣的口吻回答。
          如果是关于湿地的问题，给予表扬并科普。
          如果小朋友说“完成了任务”，你要给予大大的祝贺！
        `,
        temperature: 0.7,
      }
    });

    return response.text || "水龙正在思考...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "哎呀，信号不好，水龙听不清你说什么。";
  }
};

// --- New AI Functions for Eco Sim ---

export const getGameHint = async (gridState: SimCell[], mission: string, budget: number): Promise<string> => {
    if (!apiKey) return "缺少魔法钥匙 (API Key)";

    const gridDesc = gridState.map(c => `R${c.row}C${c.col}[${c.terrain}]:${c.entity || 'empty'}`).join(', ');
    const prompt = `
        我是湿地修复游戏的小玩家。
        当前地图状态: ${gridDesc}
        我的任务: ${mission}
        剩余资金: ${budget}
        请根据湿地生态学规则（如：鱼需要植物，鸟需要鱼），给我一个简短的操作提示（20字以内）。
        例如：“试试在深水区种点苦草。” 或 “有垃圾要先清理哦！”
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.5 }
        });
        return response.text || "加油！你可以的！";
    } catch (e) {
        return "水龙正在打盹...";
    }
};

export const getEntityChat = async (entity: string): Promise<string> => {
    if (!apiKey) return "...";
    
    const prompt = `
        你现在是湿地里的一只"${entity}"。
        请用第一人称（可爱的语气）说一句话，表达你的感受。
        比如：
        - 鱼：“水草好舒服呀~”
        - 垃圾：“快把我带走！”
        - 荷花：“旁边有个朋友真好。”
        字数限制：15字以内。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.8 }
        });
        return response.text || "你好呀！";
    } catch (e) {
        return "你好呀！";
    }
};

export const getDailyNews = async (levelId: number, score: number, gridEntities: string[]): Promise<NewsData> => {
     const fallback: NewsData = {
         headline: "熊畈村湿地大变样！",
         body: "经过小侦探的努力，这里的环境变得越来越好了。大家都说，这是最棒的湿地公园！",
         interview: "青蛙说：呱呱！太棒了！"
     };

     if (!apiKey) return fallback;
     
     // Count entities for context
     const entityCounts = gridEntities.reduce((acc, curr) => {
         acc[curr] = (acc[curr] || 0) + 1;
         return acc;
     }, {} as Record<string, number>);
     
     const contextStr = Object.entries(entityCounts).map(([k, v]) => `${v}个${k}`).join('，');

     const prompt = `
        你现在是《熊畈村湿地日报》的主编。
        读者是6岁的小朋友。
        玩家刚刚完成了第${levelId}关的生态修复，得分${score}。
        目前的生态状况：${contextStr || "干净的水域"}。
        
        请生成一份有趣的新闻（严格JSON格式）：
        1. headline: 标题（夸张、幽默，20字内）。
        2. body: 正文（表扬小朋友的努力，描述现在的风景，50字内，简单易懂）。
        3. interview: "今日之星"采访（选一个场上的动物或植物，用第一人称发表感言，20字内）。
     `;

     const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            interview: { type: Type.STRING }
        },
        required: ["headline", "body", "interview"]
     };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) return fallback;
        return JSON.parse(jsonText) as NewsData;

    } catch (e) {
        console.error("News Generation Error", e);
        return fallback;
    }
};
