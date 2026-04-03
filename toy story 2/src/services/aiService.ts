import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { filterProductsPublic, getProductById } from "./productService";
import { addToCartServer } from "./cartService";
import { getCategories } from "./categoryService";
import { getPromotionsCustomerFilter } from "./promotionService";
import { getActiveBrands } from "./brandService";
import { getSetsCustomerFilter } from "./setService";
import { getOrderById } from "./orderService";

const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_BACKUP
].filter(Boolean);

const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

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
- If the user asks for "đồ chơi giảm giá" (discounted toys) or clicks the quick action: call get_active_promotions() followed by search_products(searchTerm: 'đồ chơi') if needed to find and SHOW them directly in the chat with images and prices.
- If the user asking "Tra cứu đơn hàng" or order lookup: Ask for the Order ID (Mã đơn hàng) if they haven't provided it. Then call get_order_status(orderId: number).
- If the user wants to "vào trang khuyến mãi": call navigate_to(path='/promotion').
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
        name: "get_order_status",
        description: "Get the current status and details of an order by its order ID.",
        parameters: {
          type: "object",
          properties: {
            orderId: { type: "number" }
          },
          required: ["orderId"]
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
  private currentKeyIndex = 0;
  public onAddToCart?: (productId?: number, setId?: number, quantity?: number) => void;
  public onViewCart?: () => void;
  public onNavigate?: (path: string) => void;

  constructor() {
    this.initChat();
  }

  private initChat() {
    if (API_KEYS.length > 0 && this.currentKeyIndex < API_KEYS.length) {
      const genAI = new GoogleGenerativeAI(API_KEYS[this.currentKeyIndex]);
      const model = genAI.getGenerativeModel(
        { model: MODEL_NAME, systemInstruction },
        { apiVersion: "v1beta" }
      );
      // @ts-ignore
      this.chat = model.startChat({ tools });
    }
  }

  private async switchToBackup() {
    if (this.currentKeyIndex < API_KEYS.length - 1) {
      console.warn(`Switching to backup API key (index ${this.currentKeyIndex + 1})`);
      this.currentKeyIndex++;
      this.initChat();
      return true;
    }
    return false;
  }

  async sendMessage(userInput: string | any[]): Promise<string> {
    if (!this.chat) {
      throw new Error("Gemini API is not initialized. Please check your API Keys.");
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
            const pid = Number(args.productId);
            if (isNaN(pid)) {
              data = { error: "ID sản phẩm không hợp lệ." };
            } else {
              data = await getProductById(pid);
            }
          } else if (fnName === "get_order_status") {
            const oid = Number(args.orderId);
            if (isNaN(oid)) {
              data = { error: "Mã đơn hàng phải là một con số." };
            } else {
              data = await getOrderById(oid);
            }
          } else if (fnName === "add_to_cart") {
            const pid = Number(args.productId);
            if (isNaN(pid)) {
              data = { error: "Không tìm thấy mã sản phẩm để thêm vào giỏ hàng." };
            } else {
              if (this.onAddToCart) {
                this.onAddToCart(pid, undefined, args.quantity || 1);
              } else {
                await addToCartServer(pid, undefined, args.quantity || 1);
              }
              data = { success: true, message: "Đã thêm vào giỏ hàng!" };
            }
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
          } else if (fnName === "get_order_status") {
            data = await getOrderById(args.orderId);
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

        // Recursively call sendMessage with tool results
        return this.sendMessage(functionResponses);
      }

      return result.response.text();
    } catch (error: any) {
      console.error("Gemini AI Service Error:", error);

      // If quota or auth error, try to switch and retry
      if (error.message?.includes("429") || error.message?.includes("403") || error.message?.includes("API_KEY_INVALID")) {
        const switched = await this.switchToBackup();
        if (switched) {
          return this.sendMessage(userInput);
        }
      }

      return "Bot đang gặp lỗi rồi, bạn chờ chút nhé! 😅🛠️";
    }
  }
}

export const aiService = new AIService();
