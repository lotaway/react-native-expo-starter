import React, { useState, useMemo } from 'react';
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

interface ShoppingCartItem {
  id: number;
  productName: string;
  productPic: string;
  price: number;
  quantity: number;
  checked: boolean;
  spDataStr: string;
}

export default function CartScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [shoppingCartItems, setShoppingCartItems] = useState<ShoppingCartItem[]>([
    {
      id: 1,
      productName: '示例商品 1',
      productPic: 'https://via.placeholder.com/230',
      price: 199.0,
      quantity: 1,
      checked: true,
      spDataStr: '颜色:白色;尺寸:M',
    },
    {
      id: 2,
      productName: '示例商品 2',
      productPic: 'https://via.placeholder.com/230',
      price: 299.0,
      quantity: 2,
      checked: false,
      spDataStr: '颜色:黑色;尺寸:L',
    },
  ]);

  const toggleItemCheck = (index: number) => {
    const updatedItems = [...shoppingCartItems];
    updatedItems[index].checked = !updatedItems[index].checked;
    setShoppingCartItems(updatedItems);
  };

  const toggleAllSelection = () => {
    const isAllCurrentlySelected = shoppingCartItems.every((item) => item.checked);
    const updatedItems = shoppingCartItems.map((item) => ({ ...item, checked: !isAllCurrentlySelected }));
    setShoppingCartItems(updatedItems);
  };

  const updateItemQuantity = (index: number, delta: number) => {
    const updatedItems = [...shoppingCartItems];
    const newQuantity = updatedItems[index].quantity + delta;
    if (newQuantity >= 1) {
      updatedItems[index].quantity = newQuantity;
      setShoppingCartItems(updatedItems);
    }
  };

  const removeShoppingCartItem = (index: number) => {
    const updatedItems = [...shoppingCartItems];
    updatedItems.splice(index, 1);
    setShoppingCartItems(updatedItems);
  };

  const selectedTotalPrice = useMemo(() => {
    return shoppingCartItems
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  }, [shoppingCartItems]);

  const isAllItemSelected = shoppingCartItems.length > 0 && shoppingCartItems.every((item) => item.checked);

  if (shoppingCartItems.length === 0) {
    return (
      <View style={[styles.container, styles.empty, { backgroundColor: colors.background }]}>
        <IconSymbol name="cart.fill" size={100} color={colors.fontColorDisabled} />
        <Text style={[styles.emptyText, { color: colors.fontColorDisabled }]}>购物车竟然是空的</Text>
        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.emptyBtnText}>去逛逛</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {shoppingCartItems.map((item, index) => (
          <CartItemRow 
            key={item.id} 
            item={item} 
            index={index} 
            colors={colors} 
            onToggleCheck={toggleItemCheck} 
            onUpdateQuantity={updateItemQuantity} 
            onRemove={removeShoppingCartItem} 
          />
        ))}
        <View style={styles.footerSpacer} />
      </ScrollView>

      <CartActionBar 
        selectedTotal={selectedTotalPrice} 
        isAllSelected={isAllItemSelected} 
        colors={colors} 
        onToggleAll={toggleAllSelection} 
      />
    </SafeAreaView>
  );
}

function CartItemRow({ item, index, colors, onToggleCheck, onUpdateQuantity, onRemove }: any) {
  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => onToggleCheck(index)} style={styles.checkbox}>
        <IconSymbol
          name={item.checked ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={item.checked ? colors.primary : colors.fontColorDisabled}
        />
      </TouchableOpacity>
      <Image source={{ uri: item.productPic }} style={styles.productImage} />
      <View style={styles.itemRight}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.fontColorDark }]}>
          {item.productName}
        </Text>
        <Text style={[styles.attr, { color: colors.fontColorLight }]}>{item.spDataStr}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>¥{item.price}</Text>
          <View style={styles.stepBox}>
            <TouchableOpacity onPress={() => onUpdateQuantity(index, -1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stepVal}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(index, 1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(index)} style={styles.delBtn}>
        <IconSymbol name="xmark" size={16} color={colors.fontColorLight} />
      </TouchableOpacity>
    </View>
  );
}

function CartActionBar({ selectedTotal, isAllSelected, colors, onToggleAll }: any) {
  return (
    <View style={styles.actionSection}>
      <TouchableOpacity onPress={onToggleAll} style={styles.allCheck}>
        <IconSymbol
          name={isAllSelected ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={isAllSelected ? colors.primary : colors.fontColorDisabled}
        />
        <Text style={[styles.allCheckText, { color: colors.fontColorBase }]}>全选</Text>
      </TouchableOpacity>
      <View style={styles.totalBox}>
        <Text style={[styles.totalLabel, { color: colors.fontColorDark }]}>
          合计: <Text style={[styles.totalPrice, { color: colors.primary }]}>¥{selectedTotal}</Text>
        </Text>
      </View>
      <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]}>
        <Text style={styles.confirmBtnText}>结算</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
  },
  emptyBtn: {
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
  },
  checkbox: {
    marginRight: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemRight: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  attr: {
    fontSize: 12,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  stepBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 18,
    color: '#333',
  },
  stepVal: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
  },
  delBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  actionSection: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 20,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  allCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allCheckText: {
    marginLeft: 8,
    fontSize: 14,
  },
  totalBox: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerSpacer: {
    height: 120,
  },
});
