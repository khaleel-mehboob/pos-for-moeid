$(function() {
	"use strict";
	
	$(document).ready(function() {
		$('#Transaction-History').DataTable({
			lengthMenu: [[6, 10, 20, -1], [6, 10, 20, 'Todos']]
		});
		$('#myTable').DataTable();
	});
	
});