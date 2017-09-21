import React from 'react';
import ReactDOM from 'react-dom';
import './font-awesome-4.7.0/css/font-awesome.css'
import './index.css';

class RefreshButton extends React.Component {
    render() {
        return (
            <i className="fa fa-refresh refresh-button" aria-hidden="true" onClick={() => this.props.onClick()}></i>
        );
    }
}

function WeatherIcon(props) {
    var background = '';
    var foreground = '';
    console.log(props.value);
    switch(props.value){
        case 'chanceflurries':
        case 'flurries':
        case 'chancesleet':
        case 'sleet':
        case 'snow':
        case 'chancesnow':
            background = 'fa fa-snowflake-o fa-3x';
            foreground = 'weather-icon';
        break;
        case 'chancerain':
        case 'rain':
            background = 'fa fa-tint fa-3x';
            foreground = '';
        break;
        case 'chancetstorms':
        case 'tstorms':
        case 'unknown':
            background = 'fa fa-bolt fa-3x weather-icon-tstorm-background';
            foreground = 'fa fa-cloud fa-3x weather-icon-tstorm-foreground';
        break;
        case 'clear':
        case 'sunny':
            background = 'fa fa-sun-o fa-3x weather-icon-sun';
            foreground = '';
        break;
        case 'cloudy':
            background = 'fa fa-cloud fa-3x';
            foreground = '';
        break;
        case 'fog':
            background = '';
            foreground = '';
        break;
        case 'hazy':
            background = '';
            foreground = '';
        break;
        case 'mostlycloudy':
        case 'mostlysunny':
        case 'partlycloudy':
        case 'partlysunny':
            background = 'fa fa-sun-o fa-3x weather-icon-sun';
            foreground = 'fa fa-cloud fa-3x';
        break;
        default:
            background = '';
            foreground = '';
        break;
    }
    return (
        <div className='weather-icon-wrapper'>
            <i className={ "weather-icon-background " + background }></i>
            <i className={ "weather-icon-foreground " + foreground }></i>
        </div>
    );
}

class WeatherWidget extends React.Component {
    constructor() {
        super();
        this.state = {
            temp: 0,
            feelsLike: 0,
            iconAlt: '',
            icon: '',
        };
        this.getWeatherData();
    }

    renderWeatherIcon(weatherStatus){
        return (
            <WeatherIcon
                value={ weatherStatus }
            />
        )
    }

    renderRefreshButton(){
        return (
            <RefreshButton
                onClick={() => this.getWeatherData()}
            />
        );
    }

    getWeatherData() {
        var xhr = new XMLHttpRequest();
        var url = "http://api.wunderground.com/api/e9da1475c57ebdd8/conditions/q/CA/Calgary.json";

        xhr.onload = function() {
            if (xhr.readyState === 4 && xhr.status === 200){
                var jsonWeatherData = JSON.parse(xhr.response);
                console.log(jsonWeatherData);
                this.setState({
                    temp: jsonWeatherData['current_observation']['temp_c'],
                    feelsLike: jsonWeatherData['current_observation']['feelslike_c'],
                    iconAlt: jsonWeatherData['current_observation']['icon'],
                    icon: jsonWeatherData['current_observation']['icon_url']
                });
            }
            else{
                console.error(xhr.statusText);
            }
        }.bind(this);

        xhr.open("GET", url, true);
        xhr.send();
    }

    render() {
        return (
            <div className="weather-widget-container">
                <div className="weather-widget-header">
                    <div className="weather-widget-separator">
                        {this.renderWeatherIcon(this.state.iconAlt)}
                        <div className="weather-widget-temp-container">
                            <h1>{this.state.temp+'°'}</h1>
                        </div>
                    </div>
                    <div className="weather-widget-refresh-container">
                        {this.renderRefreshButton()}
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <div style={{margin: "12px"}}>
        <WeatherWidget />
    </div>,
    document.getElementById('root')
);
