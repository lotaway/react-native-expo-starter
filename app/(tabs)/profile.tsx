import React from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
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


export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const changeLanguage = () => {
    Alert.alert(
      t('settings.language_title'),
      '',
      [
        {
          text: t('settings.zh'),
          onPress: async () => {
            await i18n.changeLanguage('zh');
            await AsyncStorage.setItem('user-language', 'zh');
          },
        },
        {
          text: t('settings.en'),
          onPress: async () => {
            await i18n.changeLanguage('en');
            await AsyncStorage.setItem('user-language', 'en');
          },
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ],
    );
  };

  const currentMallUser: MallUserAccount = {
    nickname: t('profile.nickname_guest'),
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
          <ProfileMenuCell icon="mappin.and.ellipse" title={t('profile.menu.address')} color="#5fcda2" />
          <ProfileMenuCell icon="clock.fill" title={t('profile.menu.history')} color="#e07472" />
          <ProfileMenuCell icon="star.fill" title={t('profile.menu.following')} color="#5fcda2" />
          <ProfileMenuCell icon="heart.fill" title={t('profile.menu.favorite')} color="#54b4ef" />
          <ProfileMenuCell icon="star.bubble.fill" title={t('profile.menu.comment')} color="#ee883b" />
          <ProfileMenuCell icon="globe" title={t('profile.menu.language')} color="#4a90e2" onPress={changeLanguage} />
          <ProfileMenuCell icon="gearshape.fill" title={t('profile.menu.settings')} color="#e07472" showBorder={false} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileHeader({ user, colors }: { user: MallUserAccount; colors: any }) {
  const { t } = useTranslation();
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
            <Text style={styles.vipTitle}>{t('profile.vip_gold')}</Text>
          </View>
          <TouchableOpacity style={styles.vipBtn}>
            <Text style={styles.vipBtnText}>{t('profile.vip_open_now')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.vipDesc}>{t('profile.vip_slogan')}</Text>
        <Text style={styles.vipFootnote}>{t('profile.vip_note')}</Text>
      </View>
    </View>
  );
}

function UserStatsSection({ user, colors }: { user: MallUserAccount; colors: any }) {
  const { t } = useTranslation();
  return (
    <View style={styles.statsSection}>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.integration}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>{t('profile.stats.integration')}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.growth}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>{t('profile.stats.growth')}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNum, { color: colors.fontColorDark }]}>{user.couponCount}</Text>
        <Text style={[styles.statLabel, { color: colors.fontColorLight }]}>{t('profile.stats.coupon')}</Text>
      </View>
    </View>
  );
}

function OrderQuickLinksSection({ colors }: { colors: any }) {
  const { t } = useTranslation();
  const ORDER_STATUS_LINKS = [
    { label: t('profile.orders.all'), icon: 'list.bullet.rectangle' },
    { label: t('profile.orders.unpaid'), icon: 'creditcard' },
    { label: t('profile.orders.undelivered'), icon: 'shippingbox' },
    { label: t('profile.orders.refund'), icon: 'arrow.counterclockwise' },
  ];

  return (
    <View style={styles.orderSection}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderTitle, { color: colors.fontColorDark }]}>{t('profile.orders.title')}</Text>
        <TouchableOpacity style={styles.seeAll}>
          <Text style={{ color: colors.fontColorLight }}>{t('profile.orders.see_all')}</Text>
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

function ProfileMenuCell({ icon, title, color, onPress, showBorder = true }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <TouchableOpacity style={[styles.menuCell, showBorder && styles.bottomBorder]} onPress={onPress}>
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
