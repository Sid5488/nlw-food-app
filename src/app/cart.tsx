import { useState } from "react";
import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Product } from "@/components/product";
import { ProductCartProsp, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/scripts/format-currency";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5511939510304";

const Cart = () => {
	const navigation = useNavigation();

	const [address, setAddress] = useState("");

	const { products, remove, clear } = useCartStore();

	const total = formatCurrency(
		products.reduce((total, product) => 
			total + product.price * product.quantity, 0)
	);

	const handleProductRemove = (product: ProductCartProsp) => {
		Alert.alert(
			"Remover", 
			`Deseja remover ${product.title} do carrinho?`,[
				{
					text: "Cancelar"
				},
				{
					text: "Remover",
					onPress: () => remove(product.id)
				}
			]
		);
	};

	const handleOrder = () => {
		if (address.trim().length === 0) {
			return Alert.alert("Pedido", "Informe os dados da entrega");
		}

		const orderProducts = products.map(product => 
			`\n${product.quantity} ${product.title}`
		).join("");

		const message = `
			🍔 NOVO PEDIDO
			\nEntregar em: ${address}
			
			${orderProducts}

			\n Valor total: ${total}
		`;

		Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`);

		clear();
		navigation.goBack();
	};

	return (
		<View className="flex-1 pt-8">
			<KeyboardAwareScrollView>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Header title="Seu carrinho" />

					<View className="p-5 flex-1">
						{products.length > 0 ? (
							<View className="border-b border-slate-700">
								{products.map(product => (
									<Product 
										key={product.id} 
										data={product} 
										onPress={() => handleProductRemove(product)} 
									/>
								))}
							</View>
						): (
							<Text className="font-body text-slate-400 text-center my-8">
								Seu carrinho está vazio.
							</Text>
						)}

						<View className="flex-row gap-2 items-center mt-5 mb-4">
							<Text className="text-white text-xl font-subtitle">Total:</Text>

							<Text className="text-lime-400 text-2xl font-heading">
								{total}
							</Text>
						</View>

						<Input
							placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..." 
							onChangeText={setAddress}
							blurOnSubmit={true}
							onSubmitEditing={handleOrder}
							returnKeyType="next"
						/>
					</View>
				</ScrollView>
			</KeyboardAwareScrollView>

			<View className="p-5 gap-5">
				<Button onPress={handleOrder}>
					<Button.Text>
						Enviar pedido
					</Button.Text>

					<Button.Icon>
						<Feather name="arrow-right-circle" size={20} />
					</Button.Icon>
				</Button>

				<LinkButton title="Voltar ao cardápio" href="/" />
			</View>
		</View>
	);
};

export default Cart;
