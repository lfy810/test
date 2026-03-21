class CacheManager {
    constructor() {
        this.cacheKeyPrefix = 'diabetes_assistant_';
        this.defaultExpireTime = 3600; // 默认缓存1小时
    }

    // 获取缓存数据
    get(key) {
        const fullKey = this.cacheKeyPrefix + key;
        const cachedData = sessionStorage.getItem(fullKey);
        
        if (!cachedData) return null;

        try {
            const parsedData = JSON.parse(cachedData);
            const now = Date.now();
            
            // 检查是否过期
            if (parsedData.expireTime && now > parsedData.expireTime) {
                sessionStorage.removeItem(fullKey);
                return null;
            }
            
            return parsedData.data;
        } catch (error) {
            console.error('解析缓存数据失败:', error);
            sessionStorage.removeItem(fullKey);
            return null;
        }
    }

    // 设置缓存数据
    set(key, data, expireTime = this.defaultExpireTime) {
        const fullKey = this.cacheKeyPrefix + key;
        const now = Date.now();
        const cacheData = {
            data: data,
            expireTime: now + expireTime * 1000,
            timestamp: now
        };
        
        try {
            sessionStorage.setItem(fullKey, JSON.stringify(cacheData));
            return true;
        } catch (error) {
            console.error('设置缓存失败:', error);
            return false;
        }
    }

    // 删除缓存数据
    remove(key) {
        const fullKey = this.cacheKeyPrefix + key;
        sessionStorage.removeItem(fullKey);
    }

    // 清空所有缓存
    clear() {
        const keysToRemove = [];
        for (let i = 0; i< sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.startsWith(this.cacheKeyPrefix)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key =>{
            sessionStorage.removeItem(key);
        });
    }

    // 获取缓存大小
    getCacheSize() {
        let totalSize = 0;
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.startsWith(this.cacheKeyPrefix)) {
                const value = sessionStorage.getItem(key);
                totalSize += key.length + value.length;
            }
        }
        return totalSize;
    }
}

// 创建全局缓存管理器实例
const cacheManager = new CacheManager();

// 数据服务类
class DataService {
    constructor() {
        this.cacheManager = cacheManager;
    }

    // 获取搜索数据
    async getSearchData() {
        const cacheKey = 'search_data';
        const cachedData = this.cacheManager.get(cacheKey);
        
        if (cachedData) {
            console.log('从缓存获取搜索数据');
            return cachedData;
        }

        console.log('从API获取搜索数据');
        // 模拟API请求
        const searchData = {
            articles: [
                {
                    id: 1,
                    title: '糖尿病患者的饮食管理指南',
                    author: '王建国',
                    date: '2024-01-15',
                    image: 'img/a1.jpg',
                    url: 'article.html'
                },
                {
                    id: 2,
                    title: '适合糖尿病患者的运动方式',
                    author: '张伟明',
                    date: '2024-01-10',
                    image: 'img/a2.jpg',
                    url: 'exercise.html'
                },
                {
                    id: 3,
                    title: '血糖监测的正确方法',
                    author: '李雅琴',
                    date: '2024-01-08',
                    image: 'img/a3.jpg',
                    url: 'glucose-monitoring.html'
                }
            ],
            doctors: [
                {
                    id: 1,
                    name: '张伟明',
                    title: '内分泌科主任医师',
                    image: 'img/doc1.jpg',
                    hospital: '北京协和医院',
                    url: 'doctor-zhang.html'
                },
                {
                    id: 2,
                    name: '李雅琴',
                    title: '内分泌科副主任医师',
                    image: 'img/doc2.png',
                    hospital: '北京协和医院',
                    url: 'doctor-li.html'
                },
                {
                    id: 3,
                    name: '王建国',
                    title: '内分泌科主治医师',
                    image: 'img/doc3.png',
                    hospital: '北京协和医院',
                    url: 'doctor-wang.html'
                }
            ],
            types: [
                {
                    id: 1,
                    name: '1型糖尿病',
                    image: 'img/tnb1.png',
                    desc: '胰岛素依赖型糖尿病',
                    url: 'type1.html'
                },
                {
                    id: 2,
                    name: '2型糖尿病',
                    image: 'img/tnb2.png',
                    desc: '最常见的糖尿病类型',
                    url: 'type2.html'
                },
                {
                    id: 3,
                    name: '妊娠糖尿病',
                    image: 'img/tnb3.png',
                    desc: '孕期发生的血糖异常',
                    url: 'type-pregnancy.html'
                },
                {
                    id: 4,
                    name: '其他类型',
                    image: 'img/tnb4.png',
                    desc: '特殊类型的糖尿病',
                    url: 'type-other.html'
                }
            ]
        };

        // 缓存数据（缓存24小时）
        this.cacheManager.set(cacheKey, searchData, 86400);
        return searchData;
    }

    // 获取医师列表数据
    async getDoctorsData() {
        const cacheKey = 'doctors_data';
        const cachedData = this.cacheManager.get(cacheKey);
        
        if (cachedData) {
            console.log('从缓存获取医师数据');
            return cachedData;
        }

        console.log('从API获取医师数据');
        // 模拟API请求
        const doctorsData = [
            {
                id: 1,
                name: '张伟明',
                title: '内分泌科主任医师',
                avatar: 'img/doc1.jpg',
                description: '从事内分泌临床工作20余年，擅长糖尿病及其并发症的诊断和治疗',
                url: 'doctor-zhang.html'
            },
            {
                id: 2,
                name: '李雅琴',
                title: '内分泌科副主任医师',
                avatar: 'img/doc2.png',
                description: '专注于糖尿病患者的血糖管理和并发症预防，具有丰富的临床经验',
                url: 'doctor-li.html'
            },
            {
                id: 3,
                name: '王建国',
                title: '内分泌科主治医师',
                avatar: 'img/doc3.png',
                description: '擅长糖尿病的个体化治疗方案制定，注重患者的生活方式干预',
                url: 'doctor-wang.html'
            }
        ];

        // 缓存数据（缓存24小时）
        this.cacheManager.set(cacheKey, doctorsData, 86400);
        return doctorsData;
    }

    // 获取文章列表数据
    async getArticlesData() {
        const cacheKey = 'articles_data';
        const cachedData = this.cacheManager.get(cacheKey);
        
        if (cachedData) {
            console.log('从缓存获取文章数据');
            return cachedData;
        }

        console.log('从API获取文章数据');
        // 模拟API请求
        const articlesData = [
            {
                id: 1,
                title: '糖尿病患者的饮食管理指南',
                author: '王建国',
                date: '2024-01-15',
                image: 'img/a1.jpg',
                summary: '科学的饮食控制是糖尿病管理的重要环节，合理搭配食物，控制总热量摄入...',
                url: 'article.html'
            },
            {
                id: 2,
                title: '适合糖尿病患者的运动方式',
                author: '张伟明',
                date: '2024-01-10',
                image: 'img/a2.jpg',
                summary: '适量的运动有助于血糖控制和身体健康，选择适合自己的运动方式很重要...',
                url: 'exercise.html'
            },
            {
                id: 3,
                title: '血糖监测的正确方法',
                author: '李雅琴',
                date: '2024-01-08',
                image: 'img/a3.jpg',
                summary: '掌握正确的血糖监测技巧对病情控制至关重要，了解不同时间点监测的意义...',
                url: 'glucose-monitoring.html'
            }
        ];

        // 缓存数据（缓存24小时）
        this.cacheManager.set(cacheKey, articlesData, 86400);
        return articlesData;
    }

    // 获取糖尿病类型数据
    async getDiabetesTypesData() {
        const cacheKey = 'diabetes_types_data';
        const cachedData = this.cacheManager.get(cacheKey);
        
        if (cachedData) {
            console.log('从缓存获取糖尿病类型数据');
            return cachedData;
        }

        console.log('从API获取糖尿病类型数据');
        // 模拟API请求
        const typesData = [
            {
                id: 1,
                name: '1型糖尿病',
                image: 'img/tnb1.png',
                description: '胰岛素依赖型糖尿病',
                url: 'type1.html'
            },
            {
                id: 2,
                name: '2型糖尿病',
                image: 'img/tnb2.png',
                description: '最常见的糖尿病类型',
                url: 'type2.html'
            },
            {
                id: 3,
                name: '妊娠糖尿病',
                image: 'img/tnb3.png',
                description: '孕期发生的血糖异常',
                url: 'type-pregnancy.html'
            },
            {
                id: 4,
                name: '其他类型',
                image: 'img/tnb4.png',
                description: '特殊类型的糖尿病',
                url: 'type-other.html'
            }
        ];

        // 缓存数据（缓存24小时）
        this.cacheManager.set(cacheKey, typesData, 86400);
        return typesData;
    }

    // 获取轮播图数据
    async getCarouselData() {
        const cacheKey = 'carousel_data';
        const cachedData = this.cacheManager.get(cacheKey);
        
        if (cachedData) {
            console.log('从缓存获取轮播图数据');
            return cachedData;
        }

        console.log('从API获取轮播图数据');
        // 模拟API请求
        const carouselData = [
            {
                id: 1,
                image: 'img/lb1.png',
                title: '了解糖尿病预防',
                url: 'diabetes-education.html'
            },
            {
                id: 2,
                image: 'img/lb2.png',
                title: '健康饮食管理',
                url: 'article.html'
            },
            {
                id: 3,
                image: 'img/lb3.jpeg',
                title: '科学血糖监测',
                url: 'glucose-monitoring.html'
            }
        ];

        // 缓存数据（缓存24小时）
        this.cacheManager.set(cacheKey, carouselData, 86400);
        return carouselData;
    }
}

// 创建全局数据服务实例
const dataService = new DataService();
