import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { ViewArticleDto } from '../../types/ArticleDTO';

interface ArticleListTableProps {
  articles: ViewArticleDto[];
  onEdit: (article: ViewArticleDto) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ArticleListTable: React.FC<ArticleListTableProps> = ({ articles, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-['Red_Hat_Display']">
      <div className="overflow-x-auto text-left">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-black text-gray-600">Hình ảnh</th>
              <th className="px-6 py-4 text-sm font-black text-gray-600">Tiêu đề</th>
              <th className="px-6 py-4 text-sm font-black text-gray-600">Danh mục</th>
              <th className="px-6 py-4 text-sm font-black text-gray-600">Tác giả</th>
              <th className="px-6 py-4 text-sm font-black text-gray-600">Ngày tạo</th>
              <th className="px-6 py-4 text-sm font-black text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr key={article.articleId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-20 flex-shrink-0">
                    <img
                      className="h-full w-full rounded-lg object-cover"
                      src={article.imageUrl || 'https://via.placeholder.com/80x48?text=No+Image'}
                      alt={article.title}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900 line-clamp-2 max-w-xs">{article.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-black rounded-full bg-red-100 text-red-600 uppercase tracking-wider">
                    {article.categoryName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-bold">{article.authorName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-black">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(article.articleId)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Xem"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(article.articleId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-black">
                  Chưa có bài viết nào. Hãy nhấn "Thêm bài viết" để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleListTable;
