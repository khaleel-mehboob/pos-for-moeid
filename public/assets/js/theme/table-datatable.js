$(function() {
	"use strict";
	
	
	    // $(document).ready(function() {
			// $('#example').DataTable();
		  // } );
		  
		  
		  
		  // $(document).ready(function() {
			// var table = $('#example2').DataTable( {
			// 	lengthChange: false,
			// 	buttons: [ 'copy', 'excel', 'pdf', 'print']
			// } );
			
		  $(document).ready(function() {
				
			var table = $('#myTable').DataTable( {
				lengthChange: true,
				// processing: true,
        // serverSide: true,
				// ajax: {
				// 	url: 'api/v1/categories',
				// 	type: 'GET',
				// 	data: function ( d ) {
				// 		d.limit = 50;
				// 		// d.custom = $('#myInput').val();
				// 		// etc
				// 	}
				// },
				// buttons: [ 'copy', 'excel', 'pdf', 'print']
			} );
		 
			// table.buttons().container()
			// 	.appendTo( '#example2_wrapper .col-md-6:eq(0)' );
		} );
	
	
	});