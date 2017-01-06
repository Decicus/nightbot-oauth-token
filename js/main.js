var scopes = {
    "channel": "View and edit channel settings and join/part the bot",
    "channel_send": "Ability to send messages to the channel as Nightbot",
    "commands": "View, add, edit, and remove channel custom commands",
    "commands_default": "View, edit, enable, and disable channel default commands",
    "regulars": "View, add, and remove channel regulars",
    "song_requests": "View and edit channel song request settings",
    "song_requests_queue": "View, add, edit, and remove songs on the channel song request queue",
    "song_requests_playlist": "View, add, edit, and remove songs on the channel song request playlist",
    "spam_protection": "View, edit, enable, and disable channel spam protection filters",
    "subscribers": "View, add, and remove channel subscribers (useful for third party subscription services)",
    "timers": "View, add, edit, and remove channel timers"    
};
var params = {};


$(document).ready(function() {
    var container = $('#scopes'),
        connect = $('.connect'),
        token = $('.token'),
        hash = window.location.hash.replace('#', '');
        
    container.attr('size', Object.keys(scopes).length);
    var split = hash.split("&");
    
    if (split.length > 0) {
        $.each(split, function(index, value) {
            var param = value.split("=");
            params[param[0]] = decodeURIComponent(param[1]);
        });
    }
    
    if (params.scope) {
        params.scope = params.scope.split(" ");
    }
    
    $.each(scopes, function(scope, description) {
        $('<option/>')
            .attr('id', scope)
            .html(scope + ' &mdash; ' + description)
            .appendTo(container);
            
        if (params.scope && params.scope.indexOf(scope) >= 0) {
            $('#' + scope, container).attr('selected', "selected");
        }
    });
    
    if (params.access_token) {
        connect.hide();
        $('.well', token).html(params.access_token);
        $.each(params.scope, function(key, scope) {
            $('#list', token).append(
                $('<li/>')
                    .addClass('list-group-item')
                    .html(scope + ' &mdash; ' + scopes[scope])
            );
        });
        
        $.ajax({
            url: 'https://api.nightbot.tv/1/me?access_token=' + params.access_token,
            type: 'GET',
            dataType: 'json',
            complete: function() {
                token.show();
            },
            success: function(data) {
                if (data.status === 200) {
                    var expires = new Date(data.authorization.credentials.expires);
                    $('.date').html(expires.toLocaleString());
                }
            }
        });        
    }
    
    $('.connect a').on('click', function() {
        var auth = [];
        $(':checked', container).each(function() {
            var scope = $(this).attr('id');
            auth.push(scope);
        });
        
        var authUrl = 'https://api.nightbot.tv/oauth2/authorize?response_type=token';
        authUrl += '&client_id=' + clientId;
        authUrl += '&redirect_uri=' + encodeURIComponent(redirectUri);
        authUrl += '&scope=' + auth.join('+');
        
        window.location.href = authUrl;
    });
});
