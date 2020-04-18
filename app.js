const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/visitantes2', {
	useNewUrlParser: true,	
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const schema = new mongoose.Schema({
   
    name: { type: String, default: "Anónimo" },
    count: { type: Number, default: 1 }
  
});

const Visitor = mongoose.model('Visitor2', schema);

app.get('/', async (req, res) => { 

	let name2 = req.query.name;	

	await Visitor.find({ name: name2 }, function(err, arr) {
		if(err){
			return console.log(err);

		//SI VIENE EL NOMBRE VACIO ""
		}else if(name2 == ""){
			name2 = "Anónimo";

			const person = new Visitor({		
				name: name2,
				count: 1
			});

			person.save(function(error){
				console.log("Error visitor vacio ", error);				
			});

		//SI NO VIENE NOMBRE O SI ES PRIMERA VEZ DEL VISITANTE
		}else if( arr.length === 0){
			
			const person = new Visitor({		
				name: name2,
				count: 1
			});

			person.save(function(error){
				console.log("Error nuevo visitor ", error);				
			});

		//SI ES UN VISITANTE RECURRENTE
		}else{

			Visitor.update({ name: name2 }, { $inc: {count: 1 }}, function(err) {
			  if (err) return console.error(err);
			});

			//console.log(arr);
			//return arr;
		}
	})

	//CREACION DE TABLA PARA RESULTADOS	

	let HTML = "";
	HTML+= '<table><tbody>';
		HTML+= '<thead><tr><td>Id</td><td>Name</td><td>Visits</td></tr></thead>';

	Visitor.find(function(err, visitors) {
	  if (err) return console.error(err);	  

	  visitors.forEach(function(vis){
	  	HTML+= '<tr><td>'+vis["_id"]+'</td><td>'+vis["name"]+'</td><td>'+vis["count"]+'</td></tr>';	  	  	
	  });

	  HTML+= "</tbody></table>";
	  
	  res.send(HTML);
	});	

});

app.listen(3000, () => console.log('Listening on port 3000!'));
