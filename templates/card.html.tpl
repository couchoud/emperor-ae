<div class="fullscreen card<%= card.type === 0 ? ' blitz' : '' %>">
    <div class="fullscreen face front">
        <div class="card-header">
            <ul class="unstyled rebel-icons">
                <% _.each(card.icons, function( icon ) { %>
                <li class="rebel-icon-<%= icon.name %>">$</li>
                <% }); %>
            </ul>
        </div>
        <div class="content">
            <div class="wrap">
                <h1><em>blitz!</em></h1>
                <div class="actions">
                    <ul>
                        <% _.each(card.actions, function( action ) { %>
                        <li><%= action.name %></li>
                        <% }); %>
                    </ul>
                </div>
                <div class="blitz-content">
                    <div>
                        <p>Attack and Ability actions target the Rebel with the most damage.</p>
                        <p>The Emperor gains 2 threat.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer clearfix">
            <div class="decision-bits">
            <i class="icon icon-bit-<%= card.bit ? 'true' : 'false' %>"></i>
            </div>
            <div class="card-count"><%= card_number %>/<%= total_cards %></div>
        </div>
    </div>
    <div class="fullscreen face back"></div>
</div>
