document.addEventListener('DOMContentLoaded', function() {

$(document).ready(function(){
    $("#EnviarDatos").click(function(){
        var db = window.sqlitePlugin.openDatabase({name: 'routes.db', location: 'default'});
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM routes', [], function(tx, result) {
                let routes = [];
                if(result.rows.length > 0){
                    for (let i = 0; i < result.rows.length; i++) {
                        routes.push(result.rows.item(i));
                        
                    }
                     $.post('https://www.innovaredgroup.cl/rutas/saveRoutes.php', JSON.stringify(routes), function(response) {
                        console.log(JSON.stringify(routes));
                        console.log('Éxito:', response);
                    }, 'json')
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error('Error:', textStatus, errorThrown);
                    });
                   /* $.ajax({
                        url: 'https://www.innovaredgroup.cl/saveRoutes.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(routes),
                        success: function(response) {
                            alert('Routes sent successfully!');
                            db.transaction(function(tx) {
                                tx.executeSql('DELETE FROM routes');
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log('Error:', textStatus, errorThrown);
                            console.log('Response:', jqXHR.responseText);
                        }
                    });*/
                }
            });
        });
    
    })

})
})


    
    
