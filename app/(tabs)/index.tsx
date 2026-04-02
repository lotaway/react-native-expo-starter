import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchMallHomeContent, MallHomeContent } from '@/api/home';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const CATE_ITEMS = [
  { name: '专题', icon: 'star.fill' },
  { name: '话题', icon: 'bubble.left.fill' },
  { name: '优选', icon: 'checkmark.seal.fill' },
  { name: '特惠', icon: 'tag.fill' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [mallHomeData, setMallHomeData] = useState<MallHomeContent | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadMallContent = useCallback(async () => {
    try {
      const response = await fetchMallHomeContent();
      setMallHomeData(response.data);
      setIsDataLoaded(true);
    } catch {
      // Error handled by interceptor
    }
  }, []);

  useEffect(() => {
    loadMallContent();
  }, [loadMallContent]);

  const navigateToProductDetail = (productId: number) => {
    router.push({ pathname: '/product/[id]', params: { id: productId } });
  };

  if (!isDataLoaded) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        <HomeHeader colors={colors} />
        
        <BannerSection advertiseList={mallHomeData?.advertiseList || []} />
        
        <CategorySection colors={colors} />

        {mallHomeData?.brandList && (
          <BrandSection brandList={mallHomeData.brandList} colors={colors} />
        )}

        {mallHomeData?.homeFlashPromotion && (
          <FlashSection promotion={mallHomeData.homeFlashPromotion} colors={colors} onProductPress={navigateToProductDetail} />
        )}

        <ProductGridSection 
          title="新鲜好物" 
          subtitle="为你寻觅世间好物" 
          productList={mallHomeData?.newProductList || []} 
          colors={colors} 
          onProductPress={navigateToProductDetail} 
        />

        <ProductGridSection 
          title="人气推荐" 
          subtitle="大家都赞不绝口的" 
          productList={mallHomeData?.hotProductList || []} 
          colors={colors} 
          onProductPress={navigateToProductDetail} 
        />

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeHeader({ colors }: { colors: any }) {
  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.searchBox}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.fontColorLight} />
        <Text style={[styles.searchText, { color: colors.fontColorLight }]}>
          请输入商品 如：手机
        </Text>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIcon}>
          <IconSymbol name="qrcode.viewfinder" size={24} color={colors.fontColorDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <IconSymbol name="bell" size={24} color={colors.fontColorDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BannerSection({ advertiseList }: { advertiseList: any[] }) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.bannerContainer}
    >
      {advertiseList.map((item, index) => (
        <TouchableOpacity key={index} activeOpacity={0.9}>
          <Image source={{ uri: item.pic }} style={styles.bannerImage} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function CategorySection({ colors }: { colors: any }) {
  return (
    <View style={styles.cateSection}>
      {CATE_ITEMS.map((item, index) => (
        <TouchableOpacity key={index} style={styles.cateItem}>
          <View style={[styles.cateIconBox, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name={item.icon as any} size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cateName, { color: colors.fontColorDark }]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function BrandSection({ brandList, colors }: { brandList: any[]; colors: any }) {
  return (
    <>
      <SectionHeader title="品牌制造商直供" subtitle="工厂直达消费者，剔除品牌溢价" />
      <View style={styles.brandGrid}>
        {brandList.slice(0, 4).map((item, index) => (
          <TouchableOpacity key={index} style={styles.brandItem}>
            <Image source={{ uri: item.logo }} style={styles.brandLogo} resizeMode="contain" />
            <Text style={[styles.brandName, { color: colors.fontColorDark }]}>{item.name}</Text>
            <Text style={[styles.brandCount, { color: colors.fontColorLight }]}>
              商品数量：{item.productCount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

function FlashSection({ promotion, colors, onProductPress }: { promotion: any; colors: any; onProductPress: (id: number) => void }) {
  return (
    <>
      <SectionHeader title="秒杀专区" subtitle="下一场开始" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flashScroll}>
        {promotion.productList.map((item: any, index: number) => (
          <TouchableOpacity key={index} style={styles.flashItem} onPress={() => onProductPress(item.id)}>
            <Image source={{ uri: item.pic }} style={styles.flashImage} />
            <Text numberOfLines={1} style={[styles.productTitle, { color: colors.fontColorDark }]}>
              {item.name}
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>￥{item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

function ProductGridSection({ title, subtitle, productList, colors, onProductPress }: { title: string; subtitle: string; productList: any[]; colors: any; onProductPress: (id: number) => void }) {
  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.productGrid}>
        {productList.map((item, index) => (
          <TouchableOpacity key={index} style={styles.productItem} onPress={() => onProductPress(item.id)}>
            <Image source={{ uri: item.pic }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text numberOfLines={1} style={[styles.productTitle, { color: colors.fontColorDark }]}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={[styles.productSubtitle, { color: colors.fontColorLight }]}>
                {item.subTitle}
              </Text>
              <Text style={[styles.price, { color: colors.primary }]}>￥{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleBox}>
        <Text style={[styles.sectionTitle, { color: colors.fontColorDark }]}>{title}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.fontColorLight }]}>{subtitle}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.fontColorLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  searchBox: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerIcon: {
    marginLeft: 15,
  },
  bannerContainer: {
    height: 180,
  },
  bannerImage: {
    width: WINDOW_WIDTH - 30,
    height: 160,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  cateSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  cateItem: {
    alignItems: 'center',
  },
  cateIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cateName: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  sectionTitleBox: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  brandItem: {
    width: (WINDOW_WIDTH - 40) / 2,
    marginHorizontal: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  brandLogo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '500',
  },
  brandCount: {
    fontSize: 11,
    marginTop: 2,
  },
  flashScroll: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  flashItem: {
    width: 140,
    marginHorizontal: 5,
  },
  flashImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  productItem: {
    width: (WINDOW_WIDTH - 30) / 2,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  productImage: {
    width: (WINDOW_WIDTH - 30) / 2,
    height: (WINDOW_WIDTH - 30) / 2,
    borderRadius: 8,
  },
  productInfo: {
    paddingVertical: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  productSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  footerSpacer: {
    height: 100,
  },
});
