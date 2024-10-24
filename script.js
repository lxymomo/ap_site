document.addEventListener('DOMContentLoaded', function() {
    // 导航树展开/收起功能
    const navHeaders = document.querySelectorAll('.nav-header');
    
    navHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // 如果点击的不是当前激活的导航，则关闭其他所有展开的导航
            if (!isActive) {
                navHeaders.forEach(h => {
                    if (h !== this && h.classList.contains('active')) {
                        h.classList.remove('active');
                        const c = h.nextElementSibling;
                        if (c && c.classList.contains('nav-content')) {
                            c.style.height = '0px';
                            setTimeout(() => {
                                c.classList.remove('show');
                            }, 300);
                        }
                    }
                });
            }

            // 切换当前导航的状态
            this.classList.toggle('active');
            
            if (content && content.classList.contains('nav-content')) {
                if (!isActive) {
                    content.classList.add('show');
                    content.style.height = content.scrollHeight + 'px';
                } else {
                    content.style.height = '0px';
                    setTimeout(() => {
                        content.classList.remove('show');
                    }, 300);
                }
            }
        });
    });

    // 导航项点击处理
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('.main-content');
    
    // 页面内容缓存
    const contentCache = {};
    
    navItems.forEach(item => {
        item.addEventListener('click', async function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            
            // 移除其他项的激活状态
            navItems.forEach(i => i.classList.remove('active'));
            
            // 添加当前项的激活状态
            this.classList.add('active');

            const pageId = this.getAttribute('data-page');
            if (!pageId) return;

            try {
                let content;
                
                // 检查缓存中是否已有该页面内容
                if (contentCache[pageId]) {
                    content = contentCache[pageId];
                } else {
                    // 显示加载状态
                    mainContent.innerHTML = `
                        <div class="loading-indicator">
                            <div class="spinner"></div>
                            <div>加载中...</div>
                        </div>
                    `;

                    // 模拟API请求延迟
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // 这里应该是实际的API请求
                    // const response = await fetch(`/api/pages/${pageId}`);
                    // content = await response.text();
                    
                    // 模拟内容
                    content = generateDummyContent(pageId);
                    
                    // 存入缓存
                    contentCache[pageId] = content;
                }

                // 更新主内容区
                mainContent.innerHTML = content;

                // 滚动到顶部
                mainContent.scrollTo(0, 0);

            } catch (error) {
                console.error('Failed to load page content:', error);
                mainContent.innerHTML = `
                    <div class="error-message">
                        <h2>加载失败</h2>
                        <p>抱歉，内容加载失败。请稍后重试。</p>
                    </div>
                `;
            }
        });
    });

    // 搜索框快捷键处理
    const searchBox = document.querySelector('.search-box input');
    
    document.addEventListener('keydown', function(e) {
        // Command + K (Mac) 或 Ctrl + K (Windows)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchBox.focus();
        }
    });

    // 生成模拟内容的辅助函数
    function generateDummyContent(pageId) {
        const titles = {
            'overview': '概述',
            'strategy': '量化策略',
            'api': 'API对话',
            'website': '网站使用',
            'ai': 'AI使用',
            'strategy-intro': '策略介绍',
            'membership': '会员订阅',
            'roadmap': '路线图',
            'elite': '精英会员',
            'tech': '技术资源'
        };

        return `
            <div class="content-header">
                <h1>${titles[pageId] || '未知页面'}</h1>
            </div>
            <div class="content-body">
                <p>这是 ${titles[pageId]} 的示例内容。</p>
                <ul>
                    <li>示例内容项 1</li>
                    <li>示例内容项 2</li>
                    <li>示例内容项 3</li>
                </ul>
                <p>更多内容正在完善中...</p>
            </div>
        `;
    }

    // 初始化：默认展开第一个导航项
    const firstNavHeader = document.querySelector('.nav-header');
    if (firstNavHeader) {
        firstNavHeader.click();
    }
});

// 添加页面加载完成后的渐入效果
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// 监听窗口大小变化，适配响应式布局
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        mainContent.style.marginLeft = '0';
        sidebar.classList.remove('active');
    } else {
        if (!sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '280px';
        }
    }
});