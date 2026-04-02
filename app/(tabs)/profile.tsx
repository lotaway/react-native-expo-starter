import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface MallUserAccount {
  nickname: string;
  integration: number;
  growth: number;
  couponCount: number;
}

const ORDER_STATUS_LINKS = [
  { label: '全部订单', icon: 'list.bullet.rectangle' },
  { label: '待付款', icon: 'creditcard' },
  { label: '待收货', icon: 'shippingbox' },
  { label: '退款/售后', icon: 'arrow.counterclockwise' },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const currentMallUser: MallUserAccount = {
    nickname: '游客',
    integration: 0,
    growth: 0,
    couponCount: 0,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={currentMallUser} colors={colors} />
        
        <UserStatsSection user={currentMallUser} colors={colors} />

        <OrderQuickLinksSection colors={colors} />

        <View style={styles.menuSection}>
          <ProfileMenuCell icon="mappin.and.ellipse" title="地址管理" color="#5fcda2" />
          <ProfileMenuCell icon="clock.fill" title="我的足迹" color="#e07472" />
          <ProfileMenuCell icon="star.fill" title="我的关注" color="#5fcda2" />
          <ProfileMenuCell icon="heart.fill" title="我的收藏" color="#54b4ef" />
          <ProfileMenuCell icon="star.bubble.fill" title="我的评价" color="#ee883b" />
          <ProfileMenuCell icon="gearshape.fill" title="设置" color="#e07472" showBorder={false} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileHeader({ user, colors }: { user: MallUserAccount; colors: any }) {
  return (
    <View style={styles.userSection}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000' }}
        style={styles.bgImage}
      />
      <View style={styles.userInfoBox}>
        <View style={styles.portraitBox}>
          <IconSymbol name="person.circle.fill" size={60} color="#fff" />
        </View>
        <Text style={styles.username}>{user.nickname}</Text>
      </View>
      
      <View style={styles.vipCardBox}>
        <View style={styles.vipHeader}>
          <View style={styles.vipTitleLine}>
            <IconSymbol name="crown.fill" size={16} color="#f7d680" />
            <Text style={styles.vipTitle}>黄金会员</Text>
          </View>
          <TouchableOpacity style={styles.vipBtn}>
            <Text style={styles.vipBtnText}>立即开通</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.vipDesc}>mall移动端商城</Text>
        <Text style={styles.vipFootnote}>黄金及以上会员可享有会员价优惠商品。</Text>
      </View>
    </View>
  );
}

function UserStatsSection({ user, colors }: { user: MallUserAccount; colors: any }) {
  return (
    <View style={styles.statsSection}>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.integration}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>积分</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.growth}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>成长值</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.couponCount}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>优惠券</Text>
      </View>
    </View>
  );
}

function OrderQuickLinksSection({ colors }: { colors: any }) {
  return (
    <View style={styles.orderSection}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderTitle, { color: colors.fontColorDark }]}>我的订单</Text>
        <TouchableOpacity style={styles.seeAll}>
          <Text style={{ color: colors.fontColorLight }}>查看全部</Text>
          <IconSymbol name="chevron.right" size={12} color={colors.fontColorLight} />
        </TouchableOpacity>
      </View>
      <View style={styles.orderGrid}>
        {ORDER_STATUS_LINKS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.orderItem}>
            <IconSymbol name={item.icon as any} size={28} color={colors.primary} />
            <Text style={[styles.orderLabel, { color: colors.fontColorDark }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ProfileMenuCell({ icon, title, color, showBorder = true }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <TouchableOpacity style={[styles.menuCell, showBorder && styles.bottomBorder]}>
      <View style={styles.menuLeft}>
        <IconSymbol name={icon} size={20} color={color} />
        <Text style={[styles.menuTitle, { color: colors.fontColorDark }]}>{title}</Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.fontColorLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    height: 260,
    paddingTop: 50,
    paddingHorizontal: 20,
    position: 'relative',
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  userInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  portraitBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  vipCardBox: {
    marginTop: 30,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vipTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipTitle: {
    color: '#f7d680',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  vipBtn: {
    backgroundColor: '#f7d680',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vipBtnText: {
    color: '#303133',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vipDesc: {
    color: '#f7d680',
    fontSize: 14,
    marginTop: 10,
  },
  vipFootnote: {
    color: '#d8cba9',
    fontSize: 11,
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: -20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  orderSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderItem: {
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    paddingVertical: 5,
  },
  menuCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    marginLeft: 15,
  },
  bottomSpacer: {
    height: 40,
  },
});
