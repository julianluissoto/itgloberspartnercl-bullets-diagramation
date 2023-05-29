import React, { FC, useEffect } from "react"
import { useProduct } from 'vtex.product-context'
import { SliderLayout } from "vtex.slider-layout";
import { ListContextProvider } from 'vtex.list-context'
import productRecommendations from '../graphql/queries/recomendation.gql'
import { useLazyQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { css_accesory } from '../types/styles'

const MobileAccesory: FC = (props: any) => {

  const [SearchProductRecommendations, { data: dataRecomendation, loading: loadingRecomendation, error: errorRecomendation }] = useLazyQuery(productRecommendations)
  const handles = useCssHandles(css_accesory)
  const settings = props.settings;
  const productContext = useProduct()
  function formatoPrecio(num: any) {
    if (typeof num === 'string') {
      num = num.slice(0, -2);
    } else if (typeof num === 'number') {
      num = num / 100;
    }
    return num.toLocaleString('en-US', { sytyle: 'currency', currency: 'USD', minimumFractionDigits: 2 })
      .replace(/,/g, "'");
  }
  function obtenerSubruta(url: string) {
    const posicion = url.indexOf('.br');
    if (posicion >= 0) {
      return url.substring(posicion + 3);
    } else {
      return 'La URL no contiene ".br".';
    }
  }
  useEffect(() => {
    productContext.product ?
      SearchProductRecommendations({
        variables: {
          "identifier": {
            "field": "id",
            "value": productContext.product.productId
          },
          "type": "accessories"
        }
      })
      :
      ""//pass
  }, [productContext])



  if (loadingRecomendation) {
    //pass
  } else if (errorRecomendation) {
    console.log(errorRecomendation)
  }
  const productElements = dataRecomendation?.productRecommendations.map((product: any, index: any) => {
    if (index < 3) {
      return (
        <div className={`${handles.container_item}`}>
          <div className={`${handles.col_left}`}>
            <span className={`${handles.span_product_name}`}>{product.productName}</span>
            <span className={`${handles.span_product_price}`}>{formatoPrecio(product.items[0].sellers[0].commertialOffer.Price)}</span>
            <a href={obtenerSubruta(product.link)} className={`${handles.button_add}`}><span className={`${handles.span_button_add}`}>Añadir al carrito</span></a>
          </div>
          <div className={`${handles.col_right}`}>
            <img src={product.items[0].images[0].imageUrl} className={`${handles.image_accesory}`}></img>
          </div>
        </div>
      );
    }
    else {
      return (<div className="hidden-value"></div>)
    }
  });
  return (
    <>
      <ListContextProvider list={productElements}>
        <SliderLayout {...settings} />
      </ListContextProvider>
    </>
  )
};

export default MobileAccesory;
