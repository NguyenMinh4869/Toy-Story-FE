import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import ArticleListTable from '../../components/admin/ArticleListTable';
import {
  getArticles,
  getArticleCategories,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById
} from '../../services/articleService';
import type { 
  ViewArticleDto, 
  ViewArticleCategoryDto, 
  CreateArticleDto, 
  UpdateArticleDto 
} from '../../types/ArticleDTO';
import { confirmAction } from '../../utils/confirmAction';
import { runAsync } from '../../utils/runAsync';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { useAuth } from '../../hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PAGE_SIZE = 8;

const ArticleManagementPage: React.FC = () => {
  const [articles, setArticles] = useState<ViewArticleDto[]>([]);
  const [categories, setCategories] = useState<ViewArticleCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ViewArticleDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [formData, setFormData] = useState<CreateArticleDto>({
    title: '',
    shortDescription: '',
    content: '',
    imageUrl: '',
    authorName: user?.name || 'Admin',
    articleCategoryId: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getArticleCategories()
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'articleCategoryId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentArticle) {
        await updateArticle(currentArticle.articleId, formData as UpdateArticleDto);
      } else {
        await createArticle(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await confirmAction('Bạn có chắc muốn xóa bài viết này?', async () => {
      await runAsync(async () => {
        await deleteArticle(id);
        await fetchData();
      }, setError, 'Failed to delete article');
    });
  };

  const openCreateModal = () => {
    setCurrentArticle(null);
    setFormData({
      title: '',
      shortDescription: '',
      content: '',
      imageUrl: '',
      authorName: user?.name || 'Admin',
      articleCategoryId: categories[0]?.articleCategoryId || 0
    });
    setActiveTab('edit');
    setIsModalOpen(true);
  };

  const openEditModal = async (article: ViewArticleDto) => {
    setCurrentArticle(article);
    try {
      setLoading(true);
      const details = await getArticleById(article.articleId);
      setFormData({
        title: details.title,
        shortDescription: details.shortDescription,
        content: details.content,
        imageUrl: details.imageUrl,
        authorName: details.authorName,
        articleCategoryId: details.articleCategoryId
      });
      setActiveTab('edit');
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load article details');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="p-6 font-['Red_Hat_Display']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">Quản lý bài viết cẩm nang</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black transition-colors"
        >
          <Plus size={20} /> Thêm bài viết
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4">
          {error}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <>
          <ArticleListTable
            articles={paginatedArticles}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onView={(id) => navigate(`${ROUTES.CAM_NANG}/${id}`)}
          />
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentArticle ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
        size="xxl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tác giả</label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                  <select
                    name="articleCategoryId"
                    value={formData.articleCategoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map(c => (
                      <option key={c.articleCategoryId} value={c.articleCategoryId}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Hình ảnh</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-gray-700">Nội dung bài viết</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'edit' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Soạn thảo
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Xem trước
                        </button>
                    </div>
                </div>
                
                {activeTab === 'edit' ? (
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        placeholder="Có thể sử dụng Markdown để định dạng bài viết..."
                        className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400 min-h-[400px] font-mono text-sm leading-relaxed"
                    />
                ) : (
                    <div className="flex-1 w-full px-6 py-4 border border-gray-100 bg-gray-50 rounded-2xl overflow-y-auto max-h-[500px] prose prose-sm max-w-none">
                        {formData.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {formData.content}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-gray-400 italic text-center mt-10">Chưa có nội dung để hiển thị.</p>
                        )}
                    </div>
                )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-white bg-red-400 rounded-2xl hover:bg-red-600 disabled:opacity-50"
            >
               {loading ? 'Đang lưu...' : currentArticle ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ArticleManagementPage;
