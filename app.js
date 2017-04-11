angular.module('app', ['angular-bs-tooltip', 'ngAudio'])
	.controller('soundboardCtrl', function($interval, $http, $scope, ngAudio) {
		// Playing items {{{
		$scope.playing = 0;
		$scope.stopAll = ()=> {
			$scope.sounds.forEach(s => {
				if (s.isPlaying) s.play();
			});
		};
		// }}}

		// Data refresher {{{
		$scope.loading = false;
		$scope.sounds;
		$scope.refresh = ()=> {
			$scope.loading = true;
			$http.get('sounds/index.json')
				.then(data => $scope.sounds = data.data.map(a => {
					a.audio = ngAudio.load(a.path);
					a.play = ()=> {
						if (!a.isPlaying) {
							$scope.playing++;
							a.isPlaying = true;
							a.audio.play();
							a.audioWatch = $interval(()=> {
								if (a.audio.progress >= 1) {
									a.isPlaying = false;
									$scope.playing--;
									$interval.cancel(a.audioWatch);
								}
							}, 100);
						} else {
							a.audio.stop();
							a.isPlaying = false;
							$scope.playing--;
							$interval.cancel(a.audioWatch);
						}
					};
					console.log('SOUND', a.$audio);
					return a;
				}))
				.finally(()=> $scope.loading =false);
		};
		// }}}

		$scope.$evalAsync($scope.refresh);
	})
