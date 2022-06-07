import React from "react"
import axios from "axios"
import { Link } from 'react-router-dom'
import './PropertyComp.scss'
import { AuthContex } from "../../context/AuthContext"
import { useHttp } from "../../hooks/http.hook"
import ScrollBar from '../ScrollBar/ScrollBar'
import CustomInput from "../CustomInput/CustomInput"
import Modal from "../Modal/Modal"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import CustomTextarea from "../CustomTextarea/CustomTextarea"
import CustomToggle from '../CustomToggle/CustomToggle'

export default function PropertyComp(props) {

   const auth = React.useContext(AuthContex)

   const {loading, request, error} = useHttp()

   const [selectedProperty, setSelectedProperty] = React.useState(null)

   const [editActive, setEditActive] = React.useState(false)

   const [editForm, setEditForm] = React.useState({})

   const changeEditForm = event => {
      setEditForm({...editForm, [event.target.name]: event.target.value})
   }

   const editHandler = async () => {
      try {
         const data = await request(`/api/apartments/${selectedProperty._id}`, 'PUT', {...editForm}, {token: `Bearer ${auth.token}`})
         // setEditActive(false)
         refreshPage()
      } catch (error) {}
   }

   const deleteHandler = async (id) => {
      try {
         const data = await request(`/api/apartments/${id}`, 'DELETE', '', {token: `Bearer ${auth.token}`})
         refreshPage()
      } catch (error) {}
   }

   function refreshPage(){ 
      window.location.reload(); 
   }

   const showHandler = async (id, value) => {
      try {
         const data = await request(`/api/apartments/${id}`, 'PUT', {isOn: value}, {token: `Bearer ${auth.token}`})
      } catch (error) {console.log(error)}
   }

   const propertyElements = props.data.map(property => (
      <div className="property" key={property._id}>
         <div className="left">
            <div className="property--title">{property.title}</div>
            {/* <div className="property--address"><FontAwesomeIcon icon={faLocationDot} className="icon" /> {property.address}</div> */}
            <div className="property--address">
               <FontAwesomeIcon icon={faLocationDot} className="icon" /> {property.city}, {property.street}, д.{property.houseNum}, кв.{property.apartmentNum}
            </div>
            <div className="property--price"><span>{property.currency}{property.amount}</span>/{property.per}</div>
         </div>
         <div className="right">
            <button 
               className="property-btn edit-btn"
               onClick={e => {
               e.preventDefault();
               setSelectedProperty(property);
               setEditActive(true)}}
            >
               <FontAwesomeIcon icon={faPenToSquare} className="icon" /> редактировать
            </button>
            <div className="custom-toggle">
               <label htmlFor='isShowable'>Отображать</label>
               <input 
                  type="checkbox" 
                  id='isShowable' 
                  className="toggle-button" 
                  defaultChecked={property.isOn} 
                  // checked={property.isOn} 
                  onChange={(e) => {
                     e.stopPropagation();
                     showHandler(property._id, e.target.checked)
                  }}
               />
            </div>
         </div>
      </div>
   ))

   const modalEdit = (data) => {
      return (
         <Modal active = {editActive} setActive={setEditActive}>
            <h2 className="title">Редактировать</h2>
            <form action="/">
               <CustomInput 
                  name='title'
                  label='Название'
                  type='text'
                  value={data.title}
                  handleChange={changeEditForm}
               />
               <CustomInput 
                  name='amount'
                  label='Цена'
                  type='number'
                  value={data.amount}
                  handleChange={changeEditForm}
               />
               <CustomTextarea 
               label="Описание" 
               name="desc" 
               value={data.desc}
               handleChange={changeEditForm}
               />               
               <button className="submit-btn" onClick={e => {e.preventDefault(); editHandler()}} disabled={loading}>Выполнить</button>
               {error && <h4 className='error'>{error}</h4>}
               <button 
                  className="property-btn delete-btn"
                  onClick={e => {
                  e.preventDefault();
                  deleteHandler(selectedProperty._id)
                  }}
               >
                  <FontAwesomeIcon icon={faTrashCan} className="icon" /> удалить запись
               </button>
            </form>
         </Modal>
      )
   }
   
   return (
      <ScrollBar className="scroll">
         <div className="property-comp">
            {propertyElements}
            {/* <button className="property-btn add-btn"><FontAwesomeIcon icon={faCirclePlus} className="icon" /> Добавить</button> */}
            <Link to={process.env.PUBLIC_URL + '/create-property'} className="property-btn add-btn">
               <FontAwesomeIcon icon={faCirclePlus} className="icon" /> Добавить
            </Link>
         </div>
         {selectedProperty && modalEdit(selectedProperty)}
      </ScrollBar>
   )
}