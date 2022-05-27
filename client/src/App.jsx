import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RelatedItems from './RelatedItems/RelatedItems.jsx';
import RatingsAndReviews from './RatingsAndReviews/RatingsAndReviews.jsx';
import ProductOverview from './ProductOverview/ProductOverview.jsx';
import QuestionsAndAnswers from './QuestionsAndAnswers/QuestionsAndAnswers.jsx';

function App() {
  // Junsu: added this style globally
  const container = {
    border: '2px solid red',
    width: '1200px',
    margin: '48px auto',
    padding: '32px',
  };

  // Junsu: moved states to App
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState({});
  const [style, setStyle] = useState({photos: [], skus: {0: {quantity: 0, size: ''}}});
  const [styles, setStyles] = useState([]);
  const productID = 40346; // Junsu: this is the main product

  useEffect(() => {
    axios.request({
      url: '/reviews',
      method: 'get',
      params: {
        product_id: productID,
        count: 100,
      },
    })
      .then((response) => {
        setReviews(response.data.results);
      });
  }, []);

  useEffect(() => {
    axios.request({
      url: `/products/${productID}`,
      method: 'get',
    })
      .then((response) => {
        setProduct(response.data);
      });
  }, []);

  useEffect(() => {
    axios.request({
      url: `/products/${productID}/styles`,
      method: 'get',
    })
      .then((response) => {
        setStyle(response.data.results.find((styleId) => styleId['default?']));
        setStyles(response.data.results);
      });
  }, []);


  // Junsu: this is how I'd do related products
  // Alex: relatedItems info should prob live in RelatedItems module

  const [relatedItemIds, setRelatedItemIds] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);

  /* Junsu: there's two ways of doing this, the one below combines it, but I'm
   keeping these two useEffects because it might help when changing products */

  // useEffect(() => {
  //   axios.request({
  //     url: `/products/${productID}/related`,
  //     method: 'get',
  //   })
  //     .then((response) => {
  //       setRelatedItemIds(response.data);
  //     });
  // }, []);

  // useEffect(() => {
  //   const array = relatedItemIds.map((relatedItemId) => axios.request({
  //     url: `/products/${relatedItemId}`,
  //     method: 'get',
  //   })
  //     .then((response) => response));
  //   Promise.all(array)
  //     .then((values) => {
  //       console.log(values);
  //       setRelatedItems(values);
  //     });
  // }, [relatedItemIds]);

  useEffect(() => {
    axios.request({
      url: `/products/${productID}/related`,
      method: 'get',
    })
      .then((response) => {
        const array = response.data.map((relatedItemId) => axios.request({
          url: `/products/${relatedItemId}`,
          method: 'get',
        })
          .then((result) => result.data));
        Promise.all(array)
          .then((values) => {
            setRelatedItems(values);
          });
      });
  }, []);


  return (
    <div style={container}>
      <ProductOverview
        reviews={reviews}
        product={product}
        style={style}
        styles={styles}
        setStyle={setStyle}
      />
      {/* <RatingsAndReviews /> */}
      {/* <QuestionsAndAnswers /> */}
      <RelatedItems
        product={product}
        relatedItems={relatedItems}
      />
    </div>
  );
}
export default App;
