import React, {useState, useEffect} from 'react'
import './aplikacja.css'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline'

//import axios from 'axios'

function Aplikacja() {
    const [namePosition, setNamePosition] = useState('')
    const [descriptionPosition, setDescriptionPosition] = useState('')
    const [selectPosition, setSelectPosition] = useState('Podzespoły komputera')
    const [pricePosition, setPricePosition] = useState('')

    const [priceAll, setPriceAll] = useState(0)

    const [table, setTable] = useState([]);

    const [value, setValue] = useState();

    const [selectFilter, setSelectFilter] = useState('Wszystko')

    const [category, setCategory] = useState(['Podzespoły komputera', 'Urządzenia peryferyjne', 'Oprogramowanie', 'Inne'])
    const [newCategory, setNewCategory] = useState('')
    
    const [visCat, setVisCat] = useState(false)
    const [visName, setVisName] = useState(false)
    const [visDesc, setVisDesc] = useState(false)
    const [visPrice, setVisPrice] = useState(false)

    const[sizeCat, setSizeCat] = useState(0)
    const[priceCat, setPriceCat] = useState(0)




    //zapisywanie oraz odczytywanie danych z serwera

    //useEffect(() => {
    //    axios.get('http://localhost:3001/table"')
    //        .then(function (response) {
    //            setTable('table')
    //    })
    //    .catch(function (error) {
    //      console.log(error);
    //});
    //})

    //const handleSubmitToNode = () => {
    //    axios.post('http://localhost:3001/table"',{
    //      table: JSON.stringify(table)
    //    })
    //    .then(function (response) {
    //      console.log(response);
    //    })
    //    .catch(function (error) {
    //      console.log(error);
    //    });
    //  }




    //sprawdzamy, czy cały formularz został uzupełniony -> jeśli nie, wyskoczy nam alert w postaci wykrzyknika przy pustych polach 
    const handleCheck = () => {
        if(namePosition === ''){
            setVisName(true)
        } if (descriptionPosition === ''){
            setVisDesc(true)
        } if (pricePosition === ''){
            setVisPrice(true)
        }
           
        if (namePosition.length && descriptionPosition.length && pricePosition.length >= 1){
           
           addToList(); 

           setVisName(false)
           setVisDesc(false)
           setVisPrice(false)
       }
    }

    //dodajemy do przygotowanej tablicy wszystkie pozycje w odpowiedniej kolejności, następnie ustawiamy state'y na nic, żeby wyczyścić formularz
    const addToList = () => {
        setTable([...table, [namePosition, descriptionPosition, selectPosition, pricePosition]]);
    
        setNamePosition('');
        setDescriptionPosition('');
        setSelectPosition('Podzespoły komputera');
        setPricePosition('');
    } 

    //usuwamy pozycję wybraną przez użytkownika 
    const buttonDelete = (e, priceDelete) => {

        table.splice(e, 1);
        setPriceAll(priceAll - priceDelete);
        setValue({});
    }

    //dodajemy nową kategorię
    const addNewCat = () => {
        setCategory([...category, (newCategory)]);
        setNewCategory('')
    }

    //obsługa edycji wybranej pozycji
    const buttonEdit = (nameEdit, desEdit, catEdit, priceEdit) => {
        setNamePosition(nameEdit);
        setDescriptionPosition(desEdit);
        setSelectPosition(catEdit);
        setPricePosition(priceEdit);
    }
    
    //generator PDF'a, później przenosci nas do miejsca, z którego bardzo łatwo można wydrukować tabelkę
    const generatePDF = () => {
        html2canvas(document.querySelector("#report")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0, 250, 0);
            pdf.save("download.pdf"); 
        });
    }

    //reset tabeli - dodane ze względu na local storage, żeby łatwo jednym przyciskiem można było zacząć od nowa
    const resetuj = () => {
        setTable([]);
        setPriceAll(0);
    }

    //obsługa drag and drop
    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(table);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        setTable(tempData);
      };

    //sortowanie
    const handleSortUpPrice = () => {
        table.sort((a,b) => {
            return b[3] - a[3]
        })
        setTable(table);
        setValue({});
    }
      
    const handleSortDownPrice = () => {
        table.sort((a,b) => {
            return a[3] - b[3]
        })
        setTable(table);
        setValue({});
    }

    const handleSortUpName = () => {
        table.sort(function(a,b) {
            if(a[0] < b[0]){
                return (-1)
            } if (a[0] > b[0]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }

    const handleSortDownName = () => {
        table.sort(function(a,b) {
            if(a[0] > b[0]){
                return (-1)
            } if (a[0] < b[0]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }

    const handleSortUpDesc = () => {
        table.sort(function(a,b) {
            if(a[1] < b[1]){
                return (-1)
            } if (a[1] > b[1]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }

    const handleSortDownDesc = () => {
        table.sort(function(a,b) {
            if(a[1] > b[1]){
                return (-1)
            } if (a[1] < b[1]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }

    const handleSortUpCat = () => {
        table.sort(function(a,b) {
            if(a[2] < b[2]){
                return (-1)
            } if (a[2] > b[2]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }

    const handleSortDownCat = () => {
        table.sort(function(a,b) {
            if(a[2] > b[2]){
                return (-1)
            } if (a[2] < b[2]){
                return (1)
            } return (0)
            
        })
        setTable(table);
        setValue({});
    }
     
    //local storage - przechowuje tabelę, ale również dodaje kategorie, które wpisał użytkownik
    useEffect(() => {
		const table = JSON.parse(localStorage.getItem('table'));
		if (table) {
			setTable(table);
		}
        const category = JSON.parse(localStorage.getItem('category'));
		if (category) {
			setCategory(category);
		}
	}, []);

    useEffect(() => {
		localStorage.setItem('table', JSON.stringify(table));
        localStorage.setItem('category', JSON.stringify(category));
	}, [table, category]);

    //oblicza rozmiar oraz cenę dla poszczególnych lategorii
    useEffect(() => {
        var size = 0;
        var price = 0;
        for(var i = 0; i<table.length; i++){
            if (table[i][2] === selectFilter) {
                size = size + 1;
                price = price + parseInt(table[i][3])
            }
        }
        setSizeCat(size)
        setPriceCat(price)
        
    },[selectFilter] )

    //oblicza cenę ogólną - dla wszystkich kategorii
    useEffect(() => {
        var priceall = 0
        for(var i = 0; i<table.length; i++){
            priceall = priceall + parseInt(table[i][3])
        } 
        setPriceAll(priceall)
    }, [table])














    return (
        <div className='background'>


            {/* div obsługującu formularz */}
            <div className='formularz'>
                <form>
                    <h1 className='form-h1'>Dodaj Produkt Do Listy</h1>
                    <div className='input-label'>
                        <label for="name" className='form-label'>Nazwa Pozycji</label> 
                        <div>
                            <input
                                id='name'
                                className='form-input'
                                type="text"
                                value={namePosition} 
                                onChange={e => setNamePosition(e.target.value)}
                            /> 
                            <ExclamationCircleIcon className='input-exclamation' style={{visibility: visName ? 'visible' : 'hidden' }}/>
                        </div>
                    </div>
                    <div className='input-label'>
                        <label for="description" className='form-label'>Opis Pozycji</label> 
                        <div>
                            <input
                                id='description'
                                className='form-input'
                                type="text"
                                value={descriptionPosition} 
                                onChange={e => setDescriptionPosition(e.target.value)}
                            /> 
                            <ExclamationCircleIcon className='input-exclamation' style={{visibility: visDesc ? 'visible' : 'hidden' }}/> 
                        </div>
                    </div>
                    <div className='input-label'>
                        <label for="select" className='form-label'>Kategoria Pozycji</label> 
                        <div>
                            <select
                                id='select'
                                onChange={e => setSelectPosition(e.currentTarget.value)}
                                value={selectPosition}
                                className='form-select'
                            >
                            {category.map((cat) =>
                                <option value={cat}>{cat}</option> )}   
                            </select> 
                            <ExclamationCircleIcon className='input-exclamation' style={{visibility: visCat ? 'visible' : 'hidden' }}/> 
                        </div>
                    </div>
                    <div className='input-label'>
                        <label></label>
                        <div>
                            <input 
                                className='form-input' 
                                placeholder='Dodaj swoją kategorię'
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                            />
                            <input 
                                id='inputPlusCat' 
                                type="button" 
                                className='button-plus' 
                                onClick={() => addNewCat()} 
                                value="+"
                            />
                        </div>
                    </div>
                    <div className='input-label'>
                        <label for="price" className='form-label'>Cena Pozycji</label> 
                        <div>
                            <input
                                id='price'
                                placeholder='PLN'
                                className='form-input'
                                type="number"
                                value={pricePosition}
                                onChange={e => setPricePosition(e.target.value)} 
                            /> 
                            <ExclamationCircleIcon className='input-exclamation' style={{visibility: visPrice ? 'visible' : 'hidden' }}/> 
                        </div>
                    </div>
                    <input 
                        type="button" 
                        onClick={() => {handleCheck();}} 
                        value="DODAJ" 
                        className='button-input'
                    />
                </form>
            </div> 

            {/* jeśli w tabeli pojawi się jakaś pozycja wyświetli się div, dzięki któremu użytkownik może filtrować kategorię oraz export do PDF */}
            {(() => {
                if (table.length > 0 ){
                    return (        
                        <div className='buttons-do-list'>
                            <div className='selects'>
                                <select
                                    className='select-filter' 
                                    onChange={e => setSelectFilter(e.currentTarget.value)}
                                    value={selectFilter}>
                                <option 
                                    className="option-filter" 
                                    value="Wszystko">
                                        Wszystko
                                </option>
                                {category.map((cat) =>
                                    <option className="option-filter" value={cat}>{cat}</option> )}
                                </select>
                            </div>
                            <button 
                                onClick={generatePDF} 
                                type="button" 
                                className='button-export'>
                                    Export do PDF
                            </button>
                        </div>
                    )
                } 
            })()}






        
            

            {(() => {
            if (table.length > 0 ){
                return (
                    <div>
                        <div className='tabela-div'>
                            <DragDropContext onDragEnd={handleDragEnd}>
                            <table id='report'>
                                <tr>
                                    <th>
                                        <div className='th-icons'>Nazwa Produktu 
                                            <div className='icons-sort'>
                                                <ChevronUpIcon className='icon-sort' onClick={handleSortUpName}/>
                                                <ChevronDownIcon className='icon-sort'onClick={handleSortDownName}/>
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='th-icons'>Szczegóły Produktu 
                                            <div className='icons-sort'>
                                                <ChevronUpIcon className='icon-sort' onClick={handleSortUpDesc}/>
                                                <ChevronDownIcon className='icon-sort'onClick={handleSortDownDesc}/>
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='th-icons'>Kategoria 
                                            <div className='icons-sort'>
                                                <ChevronUpIcon className='icon-sort' onClick={handleSortUpCat}/>
                                                <ChevronDownIcon className='icon-sort'onClick={handleSortDownCat}/>
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='th-icons'>Cena 
                                            <div className='icons-sort'>
                                                <ChevronUpIcon className='icon-sort' onClick={handleSortUpPrice}/>
                                                <ChevronDownIcon className='icon-sort'onClick={handleSortDownPrice}/>
                                            </div>
                                        </div>
                                    </th>
                                    <th>Usuń</th>
                                    <th>Edytuj</th>
                                </tr>
                                <Droppable droppableId="droppable-1">
                                    {(provider) => (
                                    <tbody
                                        ref={provider.innerRef}
                                        {...provider.droppableProps}
                                    >
                                    {selectFilter !== "Wszystko" ? table.filter(printToList => printToList[2] === selectFilter)                        
                                    .map((printToList, index) =>
                                        <Draggable
                                            key={printToList[0]}
                                            draggableId={printToList[0]}
                                            index={index}
                                        >
                                        {(provider) => (
                                            <tr {...provider.draggableProps} ref={provider.innerRef}>
                                                <td {...provider.dragHandleProps}>{printToList[0]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[1]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[2]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[3]} PLN</td>
       
                                                <td>
                                                    <button className="button-from-table" onClick={() => buttonDelete(index, printToList[3], printToList[2])}>
                                                        <TrashIcon className='trash-icon'/> 
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="button-from-table" onClick={() => buttonEdit(printToList[0],printToList[1],printToList[2],printToList[3])}>
                                                        <PencilIcon className='trash-icon'/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        </Draggable>
                                    ) : table  
                                    .map((printToList, index) =>
                                        <Draggable
                                            key={printToList[0]}
                                            draggableId={printToList[0]}
                                            index={index}
                                        >
                                        {(provider) => (
                                            <tr {...provider.draggableProps} ref={provider.innerRef}>
                                                <td {...provider.dragHandleProps}>{printToList[0]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[1]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[2]}</td>
                                                <td {...provider.dragHandleProps}>{printToList[3]} PLN</td>
    
                                                <td>
                                                    <button className="button-from-table" onClick={() => buttonDelete(index, printToList[3], printToList[2])}> 
                                                        <TrashIcon className='trash-icon'/> 
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="button-from-table" onClick={() => buttonEdit(printToList[0],printToList[1],printToList[2],printToList[3])}>
                                                        <PencilIcon className='trash-icon'/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        </Draggable>
                                    )}
                                    </tbody>
                                    )}
                                </Droppable>
                                <tr>
                                    <td className='elo'>{selectFilter === "Wszystko" ? table.length : sizeCat}  
                                        {(() => { if((selectFilter === "Wszystko" ? table.length : sizeCat) === 1){ 
                                            return (<p>&nbsp;produkt</p>)
                                        }else if ((selectFilter === "Wszystko" ? table.length : sizeCat) < 5){
                                            return (<p>&nbsp;produkty</p>)
                                        } else {
                                            return (<p>&nbsp;produktów</p>)
                                        } })()}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td>łącznie: {selectFilter === "Wszystko" ? priceAll : priceCat} PLN</td>
                                </tr>
                    
                            </table>
                            </DragDropContext>
                        </div>
                
                        <div className='buttons-under-table'>
                            <button className='button-reset' onClick={resetuj}>Resetuj</button>
                        </div>
                    </div>
                )} 
            })()}

   
    


        </div>
    )
}

export default Aplikacja