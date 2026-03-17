import type { ViewArticleDto } from '../types/ArticleDTO';
import { BLOCKS } from '@contentful/rich-text-types';

const HARDCODED_ARTICLES: ViewArticleDto[] = [
  {
    id: "1",
    title: "10 Trò Chơi Giúp Bé Phát Triển Trí Tuệ Toàn Diện Ngay Tại Nhà",
    slug: "10-tro-choi-giup-be-phat-trien-tri-tue",
    excerpt: "Những trò chơi đơn giản nhưng lại giúp bé phát triển trí tuệ một cách toàn diện. Cùng tìm hiểu xem đó là những trò chơi nào nhé!",
    author: "Admin ToyStory",
    date: "06/03/2026",
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=600&auto=format&fit=crop",
    category: "Chơi cùng con",
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Phát triển trí não cho trẻ trong những năm đầu đời (đặc biệt là giai đoạn vàng từ 0 đến 6 tuổi) là vô cùng quan trọng. Thay vì ép trẻ ngồi nhồi nhét kiến thức, việc lồng ghép các bài học thông qua trò chơi sẽ giúp trẻ dễ dàng tiếp thu, tăng cường khả năng phản xạ và tư duy logic một cách tự nhiên nhất.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.QUOTE,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [{ nodeType: "text", value: "Chơi không chỉ là cách để giải trí, mà chơi chính là 'công việc' học hỏi vĩ đại nhất của não bộ trẻ nhỏ. – Albert Einstein", marks: [{ type: "italic" }], data: {} }]
            }
          ]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "1. Trò Chơi Xếp Hình (Puzzle) và Khối Gỗ", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Xếp hình là một trong những món đồ chơi kinh điển nhưng không bao giờ lỗi thời. Hoạt động này đòi hỏi sự quan sát, ghi nhớ chi tiết và tư duy logic cao độ. Trẻ sẽ học cách nhận biết hình khối, màu sắc, rèn luyện sự khéo léo của đôi tay, và quan trọng nhất là tính kiên nhẫn để đạt được mục tiêu.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.UL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: "text", value: "Tăng khả năng phối hợp tay - mắt liên tục qua từng miếng ghép.", marks: [], data: {} }]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: "text", value: "Phát triển tư duy không gian đa chiều và hình học sơ khai.", marks: [], data: {} }]
                }
              ]
            }
          ]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "2. Trò Chơi Nhập Vai (Role-Play)", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Đóng giả làm bác sĩ, cô giáo, người bán hàng hay đầu bếp túc trực tại gian bếp nhựa xinh xắn... là những trò chơi đóng vai tuyệt vời. Thông qua việc đóng vai, các bạn nhỏ sẽ tự trang bị cho mình:", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.OL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: "text", value: "Cách thức giao tiếp xã hội và từ vựng phong phú.", marks: [], data: {} }]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: "text", value: "Sự thấu cảm (Empathy) khi đặt mình vào vị trí của người khác.", marks: [], data: {} }]
                }
              ]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: "text", value: "Khả năng xử lý tình huống linh hoạt theo trí tưởng tượng của riêng mình.", marks: [], data: {} }]
                }
              ]
            }
          ]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "3. Truy Tìm Kho Báu Bí Mật", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Hãy giấu đồ chơi yêu thích của bé (như xe mô hình, búp bê...) ở những nơi bí mật trong phòng. Cung cấp cho bé các gợi ý bằng mật mã cơ bản hoặc vẽ thành một 'tấm bản đồ kho báu' nhỏ.\n\nTrò chơi này không chỉ vận động thể chất mà còn tăng cường tư duy suy luận rất cao. Bé phải liên tục phân tích và ra quyết định thông qua gợi ý.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.HR,
          data: {},
          content: []
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Mỗi ngày, ba mẹ chỉ cần dành từ 15 đến 30 phút chơi đùa thật tập trung cùng con để đạt được những hiệu quả kỳ diệu. Hãy nhớ, chất lượng thời gian quan trọng hơn nhiều so với số lượng! Đồng hành cùng con chính là món quà đắt giá nhất.", marks: [{ type: "bold" }], data: {} }]
        }
      ]
    } as any
  },
  {
    id: "2",
    title: "Bí Quyết Chọn Đồ Chơi An Toàn Tuyệt Đối Cho Bé Dưới 3 Tuổi",
    slug: "bi-quyet-chon-do-choi-an-toan",
    excerpt: "Thị trường đồ chơi đa dạng khiến ba mẹ băn khoăn. Bài viết này sẽ chia sẻ những lưu ý vàng khi chọn đồ chơi an toàn cho trẻ sơ sinh và trẻ nhỏ.",
    author: "Chuyên gia Mẹ & Bé",
    date: "05/03/2026",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop",
    category: "Mẹo hữu ích",
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "An toàn là yếu tố đặt lên hàng đầu và KHÔNG THỂ THỎA HIỆP khi lựa chọn đồ chơi cho bé dưới 3 tuổi. Bởi ở độ tuổi này, các bé có thói quen khám phá thế giới xung quanh bằng cách... đưa mọi thứ vào miệng nhai cắn.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "1. Chất liệu phải thật sự an toàn, không chứa độc tố", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Hệ miễn dịch của bé còn non yếu nên rất dễ bị tổn thương nếu tiếp xúc với sơn độc hại hoặc hóa chất nhựa tái sinh.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.UL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [{ nodeType: BLOCKS.PARAGRAPH, data: {}, content: [{ nodeType: "text", value: "Ưu tiên chất liệu gỗ tự nhiên sơn gốc nước (water-based paint) an toàn tuyệt đối.", marks: [], data: {} }] }]
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [{ nodeType: BLOCKS.PARAGRAPH, data: {}, content: [{ nodeType: "text", value: "Chọn đồ chơi rực rỡ nhưng phải là nhựa ABS, PP hoặc Silicone y tế (100% Food-grade) không chứa BPA, Phthalates hay PVC.", marks: [], data: {} }] }]
            }
          ]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "2. Kích thước phù hợp, chống hóc nghẹn", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Nguyên tắc 'Lõi Cuộn Giấy': Bất kỳ đồ chơi hay bộ phận tháo rời nào lọt qua được hình ống của lõi cuộn giấy vệ sinh (đường kính khoảng 3.17cm và độ dài khoảng 6cm) thì tuyệt đối KHÔNG MUA CHO TRẺ DƯỚI 3 TUỔI.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "3. Nhãn mác và xuất xứ rõ ràng", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Chỉ chọn các nhãn hiệu uy tín. Quan sát trên hộp/bao bì để tìm chứng nhận an toàn uy tín toàn cầu như CE (châu Âu), ASTM (Mỹ) hoặc tem CR (Việt Nam). Đây là căn cứ rõ ràng nhất bảo chứng cho mức độ an toàn của thành phẩm đồ chơi.", marks: [], data: {} }]
        }
      ]
    } as any
  },
  {
    id: "3",
    title: "Phép Màu Đêm Khuya: Lợi Ích Của Việc Đọc Sách Cùng Con",
    slug: "loi-ich-cua-viec-doc-sach",
    excerpt: "Chỉ 15 phút đọc sách mỗi tối cùng con mang lại vô vàn lợi ích tích cực cho sự phát triển ngôn ngữ và gắn kết tình cảm gia đình.",
    author: "Tâm Lý Học Trẻ Em",
    date: "01/03/2026",
    imageUrl: "https://lh4.googleusercontent.com/proxy/jL0MqiTQM28DlDAmEshzT6SqG4JNrBVmJf9j1COJxeX3ve4EvAPIt6ZB0MPOwx_NYT_z_efMp4aMjWT0gYUjJbp05E-qWsvrtJF2mk3JMO2qSY28VZuvbsVBpvplsq1L0RUIkuKkOg",
    category: "Dạy con ngoan hiền",
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Đọc sách không chỉ là một 'công cụ' ru bé vào giấc ngủ êm đềm mỗi tối. Trong mắt các chuyên gia, 15 phút mở trang sách chính là thời gian kim cương để kết nối tình cảm gia đình sâu đậm.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.QUOTE,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [{ nodeType: "text", value: "Bạn có thể có nhiều vàng bạc, của cải hơn tôi. Nhưng bạn không bao giờ giàu có hơn tôi, bởi tôi có một người mẹ thường xuyên đọc sách cho tôi nghe... - Strckland Gillilan", marks: [{ type: "italic" }], data: {} }]
            }
          ]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "Hấp thụ ngôn ngữ cực nhạy bén", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "Từ vựng trong sách truyện thường trang trọng và đa dạng hơn so với ngôn ngữ sinh hoạt thường ngày. Chỉ qua việc lắng nghe giọng đọc diễn cảm của cha mẹ, trẻ sẽ thu nhận được khối lượng lớn từ ngữ, học cách xây dựng câu hoàn chỉnh và rèn luyện kỹ năng tập trung nghe hiểu vượt trội so với các bạn bè đồng trang lứa.", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: "text", value: "Khai mở trí tưởng tượng vô song", marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: "text", value: "So với xem ti vi (nơi sẵn có mọi âm thanh hình ảnh), việc đọc sách buộc não bộ của trẻ phải hoạt động tối đa để TỰ 'vẽ' ra bức tranh chuyển động theo lời kể. Các hiệp sĩ, nàng tiên, những loài thú biết bay... sẽ hiện lên sống động bằng trí não, giúp kích thích khả năng sáng tạo vượt biên giới.", marks: [], data: {} }]
        }
      ]
    } as any
  }
];

export const getArticles = async (): Promise<ViewArticleDto[]> => {
  return [...HARDCODED_ARTICLES];
};

export const getArticleById = async (id: string): Promise<ViewArticleDto | null> => {
  const article = HARDCODED_ARTICLES.find(a => a.id === id);
  return article || null;
};

export const getArticleCategories = async (): Promise<string[]> => {
  const categories = HARDCODED_ARTICLES.map(a => a.category);
  return Array.from(new Set(categories));
};
