import { View, FlatList, SectionList, Text } from "react-native";
import { useState, useRef } from "react";
import { Link } from "expo-router";

import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products";
import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { useCartStore } from "@/stores/cart-store";

const App = () => {
	const { products } = useCartStore();

	const [selected, setSelected] = useState(CATEGORIES[0]);

	const sectionListRef = useRef<SectionList<ProductProps>>(null);
	const cartQuantityItems = products.reduce(
		(total, product) => total + product.quantity, 0
	);

	const handleCategorySelect = (selectedCategory: string) => {
		setSelected(selectedCategory);

		const sectionIndex = CATEGORIES.findIndex(category => 
			category === selectedCategory
		);

		if (sectionListRef.current) {
			sectionListRef.current.scrollToLocation({
				animated: true,
				sectionIndex,
				itemIndex: 0
			});
		}
	};

	return (
		<View className="flex-1 pt-8 font-body">
			<Header title="Faça seu pedido" cartQuantityItems={cartQuantityItems} />

			<FlatList 
				data={CATEGORIES}
				keyExtractor={item => item}
				renderItem={
					({ item }) => (
						<CategoryButton 
							title={item} 
							isSelected={item === selected}
							onPress={() => handleCategorySelect(item)} 
						/>
					)
				}
				horizontal
				className="max-h-10 mt-5"
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
			/>

			<SectionList
				ref={sectionListRef}
				sections={MENU}
				keyExtractor={item => item.id}
				stickySectionHeadersEnabled={false}
				renderItem={({ item }) => (
					<Link href={`/product/${item.id}`} asChild>
						<Product data={item} />
					</Link>
				)}
				renderSectionHeader={({ section: { title } }) => (
					<Text className="text-xl text-white font-heading mt-8 mb-3">
						{title}
					</Text>
				)}
				className="flex-1 p-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
			/>
		</View>
	);
};

export default App;
