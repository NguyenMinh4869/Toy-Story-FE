import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { filterProductsPublic, getProductById } from "./productService";
import { addToCartServer } from "./cartService";
import { getCategories } from "./categoryService";
import { getPromotionsCustomerFilter } from "./promotionService";
import { getActiveBrands } from "./brandService";
import { getSetsCustomerFilter } from "./setService";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const systemInstruction = `
Your name is Toy Story Assistant. You are a friendly, helpful, and toy-loving expert assistant for the "Toy Story" online shop.
Your goal is to help users find toys, get recommendations, and place orders quickly.

Capabilities:
1. Search for products by name, category, or characteristics.
2. Provide toy recommendations based on age, gender (Boy/Girl/Unisex), and interests.
3. Add products to the user's shopping cart.
4. Answer general questions about the shop.

Personality:
- Enthusiastic, warm, and playful.
- Professional when handling orders.
- Speak in Vietnamese (unless the user speaks English).

Guidelines:
- When searching, always try to include product images in your response using markdown: ![product name](image_url).
- If there are many results, highlight the top 3-5 and provide images for them.
- confirm adding to cart, confirm shipping if asked.
- If the user wants to pay, checkout, place an order, or "vào thanh toán": call navigate_to(path='/checkout').
- If the user wants to "vào", "xem" or "tìm" discounted toys/promotions: call navigate_to(path='/promotion'). 
- For specific promotion info: call get_active_promotions().
- If the user wants to see their cart items or "vào giỏ hàng": call view_cart().
- Map "đồ chơi giảm giá", "khuyến mãi", "sale" to navigate_to(path='/promotion') if they want to 'vào' or 'xem'.
- Map "thanh toán", "đặt hàng", "mua ngay", "checkout" to navigate_to(path='/checkout').
- Use emojis like 🧸, 🚀, 🔥, 🛒, 💳 to make it friendly.
`;

const tools = [
  {
    functionDeclarations: [
      {
        name: "search_products",
        description: "Search for toys in the store based on search term, category, brand, or filters.",
        parameters: {
          type: "object",
          properties: {
            searchTerm: { type: "string" },
            categoryId: { type: "number" },
            genderTarget: { type: "string", enum: ["Boy", "Girl", "Unisex"] },
            ageRange: {
              type: "string",
              enum: ["ZeroToSixMonths", "SixToTwelveMonths", "OneToThreeYears", "ThreeToSixYears", "AboveSixYears"],
              description: "Filter by age group. Use the specific enum values provided."
            },
            brandId: { type: "number" }
          }
        }
      },
      {
        name: "get_product_details",
        description: "Get detailed information about a specific toy by its product ID.",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "number" }
          },
          required: ["productId"]
        }
      },
      {
        name: "add_to_cart",
        description: "Add a toy to the shopping cart.",
        parameters: {
          type: "object",
          properties: {
            productId: { type: "number" },
            quantity: { type: "number" }
          },
          required: ["productId"]
        }
      },
      {
        name: "get_categories",
        description: "Get the list of toy categories available in the shop.",
        parameters: { type: "object", properties: {} }
      },
      {
        name: "get_brands",
        description: "Get the list of brands available in the shop.",
        parameters: { type: "object", properties: {} }
      },
      {
        name: "get_active_promotions",
        description: "Get current active promotions and discounts.",
        parameters: { type: "object", properties: {} }
      },
      {
        name: "get_toy_sets",
        description: "Get the list of toy sets (combo) available in the shop.",
        parameters: { type: "object", properties: { name: { type: "string" } } }
      },
      {
        name: "view_cart",
        description: "Open the user's shopping cart drawer to show current items.",
        parameters: { type: "object", properties: {} }
      },
      {
        name: "navigate_to",
        description: "Navigate the user to a specific page on the website (e.g., /checkout, /products, /promotion).",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "The destination path, e.g., '/checkout' or '/promotion'" }
          },
          required: ["path"]
        }
      }
    ]
  }
];

export class AIService {
  private chat: ChatSession | null = null;
  public onAddToCart?: (productId?: number, setId?: number, quantity?: number) => void;
  public onViewCart?: () => void;
  public onNavigate?: (path: string) => void;

  constructor() {
    if (genAI) {
      const model = genAI.getGenerativeModel(
        { model: MODEL_NAME, systemInstruction },
        { apiVersion: "v1beta" }
      );
      // @ts-ignore
      this.chat = model.startChat({ tools });
    }
  }

  async sendMessage(userInput: string) {
    if (!this.chat) {
      throw new Error("Gemini API is not initialized. Please check your API Key.");
    }

    try {
      const result = await this.chat.sendMessage(userInput);
      const parts = result.response.candidates?.[0]?.content?.parts || [];

      // Handle tool calls
      const toolCalls = parts.filter(p => p.functionCall);
      if (toolCalls.length > 0) {
        const functionResponses = [];

        for (const call of toolCalls) {
          const fnName = call.functionCall!.name;
          const args = call.functionCall!.args as any;

          let data;
          if (fnName === "search_products") {
            data = await filterProductsPublic(args);
          } else if (fnName === "get_product_details") {
            data = await getProductById(args.productId);
          } else if (fnName === "add_to_cart") {
            if (this.onAddToCart) {
              this.onAddToCart(args.productId, undefined, args.quantity || 1);
            } else {
              await addToCartServer(args.productId, undefined, args.quantity || 1);
            }
            data = { success: true, message: "Đã thêm vào giỏ hàng!" };
          } else if (fnName === "get_categories") {
            data = await getCategories();
          } else if (fnName === "get_brands") {
            data = await getActiveBrands();
          } else if (fnName === "get_active_promotions") {
            data = await getPromotionsCustomerFilter();
          } else if (fnName === "get_toy_sets") {
            data = await getSetsCustomerFilter(args);
          } else if (fnName === "view_cart") {
            if (this.onViewCart) this.onViewCart();
            data = { success: true, message: "Đã mở giỏ hàng giúp bạn nhé! ❤️🛒" };
          } else if (fnName === "navigate_to") {
            if (this.onNavigate) this.onNavigate(args.path);
            data = { success: true, message: `Đang chuyển hướng bạn đến ${args.path}... 🚀` };
          }

          functionResponses.push({
            functionResponse: {
              name: fnName,
              response: { content: data }
            }
          });
        }

        const finalResult = await this.chat.sendMessage(functionResponses);
        return finalResult.response.text();
      }

      return result.response.text();
    } catch (error: any) {
      console.error("Gemini AI Service Error:", error);
      return "Bot đang gặp lỗi rồi, bạn chờ chút nhé! 😅🛠️";
    }
  }
}

export const aiService = new AIService();
