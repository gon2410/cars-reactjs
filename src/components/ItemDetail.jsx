import React, { useContext, useEffect, useState } from 'react'
import { doc, setDoc, getFirestore } from 'firebase/firestore';

import { CartListContext } from '../context/CartContext';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


const ItemDetail = ({id, brand, model, image, price, stock, desc, from}) => {

	const { cartList, setCartList } = useContext(CartListContext);
	const [count, setCount] = useState(1);
	const [stockk, setStockk] = useState(stock);

	function sumar() {
		if (count != stock) {
			setCount(count + 1)
		}
	}

	function restar() {
		if (count != 1) {
			setCount(count - 1)
		}
	}

	function updateStock(quant) {
		const db = getFirestore();

		const oneItem = doc(db, "autos_" + from, id);
		setDoc(oneItem, { id: id, brand: brand,
						model: model, category: from,
						image: image, price: price,
						description: desc, stock: stockk - quant});
		setStockk(stockk - quant);
	}

	useEffect(() => {
		if (stockk == 0) {
			document.getElementById("addButton").setAttribute('disabled', '');
			document.getElementById("subButton").setAttribute('disabled', '');
			document.getElementById("pluButton").setAttribute('disabled', '');
		}
	}, [stockk])


	function addtoCart() {
		let item_index;
		let exists = false
		let new_item = {id: id, cat: from,
						brand: brand, model: model,
						quantity: count, image_url: image,
						price: price, desc: desc,
						org_stock: stock}

		updateStock(count);

		for (let i = 0; i < cartList.length; i++) {
			if (cartList[i].model == new_item.model) {
				exists = true
				item_index = i
				break
			}
		}

		if (exists == true) {
			cartList[item_index].quantity += count;
			Toastify({
				text: "Agregado al carrito!",
				duration: 2000
				}).showToast();
		} else {
			setCartList(cartList => [...cartList, new_item]);
			Toastify({
				text: "Agregado al carrito!",
				duration: 2000
				}).showToast();
		}

		setCount(1);
	}

	return (
		<>
			<Container>
				<Row className="mt-5 p-5">
					<Col>
						<img className="img-fluid" src={image} alt={"image_of_" + brand + "_" + model} width={450}/>
					</Col>
					<Col>
						<h4>{brand + " " + model}</h4>

						<p className="text-success">US${price}</p>
						<p>Stock: {stockk}</p>
						<p>{desc}</p>
						
						<button className="btn border rounded" id="subButton" onClick={restar}>-</button>
						<button className="btn border rounded" id="addButton" onClick={addtoCart}>Agregar {count} </button>
						<button className="btn border rounded" id="pluButton" onClick={sumar}>+</button>
					</Col>
				</Row>
			</Container>
		</>
	)
}



export default ItemDetail